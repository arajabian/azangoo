/* Copyright (c) 2026 azangoo.com. All rights reserved.
   Copying, reuse, modification or redistribution of this code, or of its calculations,
   is prohibited without written permission. See the Terms and conditions page. */
/* Contact button: opens a small dialog with the email, a mailto link and a copy button. */
(function () {
  'use strict';
  var EMAIL = 'info.azangoo@gmail.com';
  var dlg = document.getElementById('contactDlg'),
      openBtn = document.getElementById('contactBtn'),
      closeBtn = document.getElementById('closeContact'),
      copyBtn = document.getElementById('copyMail'),
      copyMsg = document.getElementById('copyMsg');
  if (!dlg || !openBtn) return;

  openBtn.addEventListener('click', function () {
    copyMsg.textContent = '';
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  });
  closeBtn.addEventListener('click', function () {
    if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
  });
  copyBtn.addEventListener('click', function () {
    var done = function () { copyMsg.textContent = window.AzanLang.t('copied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done, function () {});
    } else {
      var ta = document.createElement('textarea');
      ta.value = EMAIL; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      ta.remove();
    }
  });
})();
