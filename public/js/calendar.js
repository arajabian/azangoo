/* Copyright (c) 2026 azangoo.com. All rights reserved.
   Copying, reuse, modification or redistribution of this code, or of its calculations,
   is prohibited without written permission. See the Terms and conditions page. */
/* Calendar card: Gregorian / Solar Hijri tabs, year and month pickers, and the PDF button.
   Text and names follow the page language. */
(function () {
  'use strict';
  var A = window.AzanLang;
  var YEARS = { shamsi: [1405, 1435], greg: [2026, 2056] };
  var mode = 'shamsi';
  var picked = null;                       /* [year, month] last chosen, kept when the language changes */

  var yearEl = document.getElementById('calYear'),
      monthEl = document.getElementById('calMonth'),
      msgEl = document.getElementById('calMsg'),
      form = document.getElementById('panel-cal'),
      tabs = { greg: document.getElementById('tab-greg'), shamsi: document.getElementById('tab-sol') };
  if (!yearEl || !monthEl) return;

  function fillOptions(sel, placeholderKey, items, selected) {
    sel.innerHTML = '';
    var first = document.createElement('option');
    first.value = ''; first.textContent = A.t(placeholderKey); first.disabled = true; first.selected = true;
    sel.appendChild(first);
    items.forEach(function (it) {
      var o = document.createElement('option');
      o.value = it.value; o.textContent = it.label;
      if (selected !== null && selected !== undefined && String(it.value) === String(selected)) { o.selected = true; first.selected = false; }
      sel.appendChild(o);
    });
  }

  function fill() {
    var range = YEARS[mode], years = [];
    for (var y = range[0]; y <= range[1]; y++) years.push({ value: y, label: A.num(y) });
    var months = [{ value: 0, label: A.t('months_all') }];          /* whole year */
    A.names(mode === 'greg' ? 'greg' : 'shamsi').forEach(function (n, i) {
      months.push({ value: i + 1, label: n });
    });
    fillOptions(yearEl, 'cal_year', years, picked ? picked[0] : null);
    fillOptions(monthEl, 'cal_month', months, picked ? picked[1] : null);
    label();
  }

  /* the label names the calendar in use, so it is clear which tab is active */
  function label() {
    var el = document.getElementById('calLabel');
    if (el) el.textContent = A.t(mode === 'greg' ? 'cal_pick_greg' : 'cal_pick_shamsi');
  }

  function setMode(m) {
    mode = m;
    Object.keys(tabs).forEach(function (k) {
      var on = k === m;
      tabs[k].classList.toggle('active', on);
      tabs[k].setAttribute('aria-selected', on ? 'true' : 'false');
    });
    fill();
    msgEl.textContent = '';
  }

  Object.keys(tabs).forEach(function (k) {
    tabs[k].addEventListener('click', function () { setMode(k); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!yearEl.value || !monthEl.value) { msgEl.textContent = A.t('cal_pick_ym'); return; }
    var place = window.AzanPlace;
    if (!place) { msgEl.textContent = A.t('cal_need_place'); return; }
    if (!window.AzanPdf) { msgEl.textContent = A.t('cal_no_pdf'); return; }
    var year = +yearEl.value, month = +monthEl.value;
    picked = [year, month];
    window.CalendarPick = { mode: mode, year: year, month: month };
    msgEl.textContent = A.t('cal_busy');
    var city = (document.getElementById('city') || {}).value || '';
    window.AzanPdf.generate({ mode: mode, year: year, month: month, place: place, city: city })
      .then(function () { msgEl.textContent = A.t('cal_done'); })
      .catch(function (err) { msgEl.textContent = A.t('cal_fail'); console.error(err); });
  });

  /* annual calendar: the Hijri months of the chosen year for the chosen place */
  var annualBtn = document.getElementById('annualBtn'), annualBox = document.getElementById('annualBox');
  var annualYear = null;
  function offsetNow(place) {
    if (place.zoneName && window.AzangooPrayerTimes) return window.AzangooPrayerTimes.offsetAt(place.zoneName, Date.now());
    return place.fallbackOffsetHours;
  }
  function renderAnnual() {
    if (!annualBox) return;
    var place = window.AzanPlace;
    if (!place || !window.MoonInfo) { annualBox.innerHTML = '<p class="msg">' + A.t('cal_need_place') + '</p>'; return; }
    var year = annualYear || (yearEl.value ? +yearEl.value : (mode === 'greg' ? new Date().getUTCFullYear() : 1405));
    var rows = window.MoonInfo.yearMonths(mode, year, place.latitude, place.longitude, offsetNow(place));
    var html = '<p class="annual-title">' + A.t('ann_title') + ' ' + A.num(year) + '</p>' +
      '<div class="annual-scroll"><table class="annual"><thead><tr>' +
      '<th>' + A.t('ann_hijri') + '</th><th>' + A.t('ann_greg') + '</th><th>' + A.t('ann_shamsi') + '</th><th>' + A.t('ann_len') + '</th>' +
      '</tr></thead><tbody>';
    rows.forEach(function (r) {
      html += '<tr><td>' + r.hijriName + ' ' + A.num(r.hijriYear) + (r.official ? ' ' + A.t('official_mark') : '') + '</td>' +
        '<td>' + A.num(r.greg.d) + ' ' + A.names('greg')[r.greg.m - 1] + ' ' + A.num(r.greg.y) + '</td>' +
        '<td>' + A.num(r.shamsi.d) + ' ' + A.names('shamsi')[r.shamsi.m - 1] + ' ' + A.num(r.shamsi.y) + '</td>' +
        '<td>' + A.num(r.len) + ' ' + A.t('ann_days') + '</td></tr>';
    });
    annualBox.innerHTML = html + '</tbody></table></div>';
  }
  /* one button opens and closes the annual calendar: open -> close it, closed -> open it */
  if (annualBtn) annualBtn.addEventListener('click', function () {
    if (annualBox && annualBox.innerHTML) {
      annualBox.innerHTML = '';
      annualBtn.setAttribute('aria-expanded', 'false');
      return;
    }
    annualBtn.setAttribute('aria-expanded', 'true');
    annualYear = null;
    renderAnnual();
  });
  window.addEventListener('azan:langchange', function () { if (annualBox && annualBox.innerHTML) renderAnnual(); });
  window.addEventListener('azan:langchange', fill);
  setMode('shamsi');
})();
