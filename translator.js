(function () {
  // ── Styles ──────────────────────────────────────────────────────────────
  const css = `
    .goog-te-banner-frame, #goog-gt-tt, .goog-te-balloon-frame,
    .goog-te-menu-frame, .skiptranslate, iframe.goog-te-menu-frame,
    .goog-te-spinner-pos { display: none !important; }
    body { top: 0 !important; margin-top: 52px !important; }
    #google_translate_element { display: none !important; }

    #sq-translator-bar {
      position: fixed;
      top: 0; left: 0;
      width: 100%;
      z-index: 99999;
      background: rgba(255,255,255,0.97);
      box-shadow: 0 2px 12px rgba(0,0,0,0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px 16px;
      gap: 4px;
      box-sizing: border-box;
    }

    .sq-lang-btn {
      background: none;
      border: none;
      padding: 7px 18px;
      border-radius: 50px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      transition: all 0.2s ease;
      white-space: nowrap;
      font-family: inherit;
    }

    .sq-lang-btn:hover { background: #f0f0f0; color: #111; }
    .sq-lang-btn.active { background: #111; color: #fff; }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── Toggle Bar ───────────────────────────────────────────────────────────
  const bar = document.createElement('div');
  bar.id = 'sq-translator-bar';
  bar.innerHTML = `
    <button class="sq-lang-btn" data-lang="en">English</button>
    <button class="sq-lang-btn" data-lang="ms">Bahasa Melayu</button>
    <button class="sq-lang-btn" data-lang="zh-CN">中文</button>
    <button class="sq-lang-btn" data-lang="ta">தமிழ்</button>
  `;
  document.body.insertBefore(bar, document.body.firstChild);

  // ── Hidden Google Translate element ──────────────────────────────────────
  const gtEl = document.createElement('div');
  gtEl.id = 'google_translate_element';
  document.body.appendChild(gtEl);

  // ── Google Translate init ─────────────────────────────────────────────
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,ms,zh-CN,ta',
      autoDisplay: false
    }, 'google_translate_element');
  };

  const gtScript = document.createElement('script');
  gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(gtScript);

  // ── Highlight active button ───────────────────────────────────────────
  function setActiveLang(lang) {
    document.querySelectorAll('.sq-lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
  }

  // ── Trigger Google Translate select ──────────────────────────────────
  let lastLang = 'en';
  let isRestoring = false;

  function triggerTranslate(lang) {
    const select = document.querySelector('.goog-te-combo');
    if (!select) {
      setTimeout(() => triggerTranslate(lang), 300);
      return;
    }
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }

  function waitForRestore(lang, tries) {
    if (tries <= 0) { triggerTranslate(lang); isRestoring = false; return; }
    const select = document.querySelector('.goog-te-combo');
    // Wait until select value is back to 'en' before switching
    if (select && select.value === 'en') {
      setTimeout(() => { triggerTranslate(lang); isRestoring = false; }, 200);
    } else {
      setTimeout(() => waitForRestore(lang, tries - 1), 200);
    }
  }

  // ── Language switching ────────────────────────────────────────────────
  function translateTo(lang) {
    setActiveLang(lang);
    if (lang === 'en') {
      triggerTranslate('en');
      lastLang = 'en';
      isRestoring = true;
      return;
    }
    if (isRestoring) {
      // Still restoring to English — wait for it to finish first
      waitForRestore(lang, 10);
    } else {
      triggerTranslate(lang);
    }
    lastLang = lang;
  }

  bar.querySelectorAll('.sq-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => translateTo(btn.dataset.lang));
  });

  // ── Set English active on load (fresh page = no translation) ─────────
  setActiveLang('en');
})();
