/* Copyright (c) 2026 azangoo.com. All rights reserved.
   Copying, reuse, modification or redistribution of this code, or of its calculations,
   is prohibited without written permission. See the Terms and conditions page. */
/* Official Hijri months (set by the site owner in data/official-months.json).
   If a month is listed there, the site shows the official start and length and marks it as official.
   Months that are not listed use the site's own prediction. */
(function (root) {
  'use strict';
  var DAY = 86400000;
  var data = null, ready = false, waiting = [];

  function dayMs(s) { var p = String(s).split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }

  /* the listed month that covers a local date (YYYY-MM-DD), or null */
  function covering(ymd) {
    if (!data || !data.months || !ymd) return null;
    var t = dayMs(ymd);
    for (var i = 0; i < data.months.length; i++) {
      var m = data.months[i], s = dayMs(m.start);
      if (t >= s && t < s + (+m.length) * DAY) return m;
    }
    return null;
  }

  function onReady(f) { if (ready) f(); else waiting.push(f); }

  function load(url) {
    if (typeof fetch === 'undefined') { ready = true; return; }
    fetch(url, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { data = d; })
      .catch(function () { data = null; })
      .then(function () { ready = true; waiting.splice(0).forEach(function (f) { f(); }); });
  }

  function all() { return (data && data.months) ? data.months : []; }
  function setData(d) { data = d; ready = true; waiting.splice(0).forEach(function (f) { f(); }); }
  var api = { load: load, covering: covering, onReady: onReady, dayMs: dayMs, all: all, setData: setData };
  if (root) root.AzanOfficial = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') load('data/official-months.json');
})(typeof window !== 'undefined' ? window : globalThis);
