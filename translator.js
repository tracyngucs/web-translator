(function () {

  // ── Styles ──────────────────────────────────────────────────────────────
  const css = `
    .goog-te-banner-frame,
    #goog-gt-tt,
    .goog-te-balloon-frame,
    .goog-te-menu-frame,
    .skiptranslate,
    iframe.goog-te-menu-frame,
    .goog-te-spinner-pos {
      display: none !important;
    }

    body {
      top: 0 !important;
      margin-top: 52px !important;
    }

    #google_translate_element {
      display: none !important;
    }

    #sq-translator-bar {
      position: fixed;
      top: 0;
      left: 0;
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

    .sq-lang-btn:hover {
      background: #f0f0f0;
      color: #111;
    }

    .sq-lang-btn.active {
      background: #111;
      color: #fff;
    }
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ── Translator Bar ─────────────────────────────────────────────────────
  const bar = document.createElement('div');
  bar.id = 'sq-translator-bar';

  bar.innerHTML = `
    <button class="sq-lang-btn" data-lang="en">English</button>
    <button class="sq-lang-btn" data-lang="ms">Bahasa Melayu</button>
    <button class="sq-lang-btn" data-lang="zh-CN">中文</button>
    <button class="sq-lang-btn" data-lang="ta">தமிழ்</button>
  `;

  document.body.insertBefore(bar, document.body.firstChild);

  // ── Hidden Google Translate Element ───────────────────────────────────
  const gtEl = document.createElement('div');
  gtEl.id = 'google_translate_element';
  document.body.appendChild(gtEl);

  // ── Google Translate Init ─────────────────────────────────────────────
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,ms,zh-CN,ta',
      autoDisplay: false
    }, 'google_translate_element');
  };

  const gtScript = document.createElement('script');
  gtScript.src =
    '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';

  document.head.appendChild(gtScript);

  // ── Highlight Active Button ───────────────────────────────────────────
  function setActiveLang(lang) {
    document.querySelectorAll('.sq-lang-btn').forEach(btn => {
      btn.classList.toggle(
        'active',
        btn.dataset.lang === lang
      );
    });
  }

  // ── Reliable Change Trigger ───────────────────────────────────────────
  function triggerChange(select) {
    select.dispatchEvent(
      new Event('change', {
        bubbles: true
      })
    );
  }

  // ── Translation Logic ─────────────────────────────────────────────────
  let switching = false;

  function translateTo(lang) {

    if (switching) return;

    const select =
      document.querySelector('.goog-te-combo');

    if (!select) {
      setTimeout(() => {
        translateTo(lang);
      }, 300);
      return;
    }

    const currentLang =
      select.value || 'en';

    setActiveLang(lang);

    switching = true;

    // Restore to English
    if (lang === 'en') {

      select.value = 'en';
      triggerChange(select);

      setTimeout(() => {
        switching = false;
      }, 700);

      return;
    }

    // Already selected language
    if (currentLang === lang) {
      switching = false;
      return;
    }

    // Coming from translated state
    if (currentLang !== 'en') {

      // Reset to English first
      select.value = 'en';
      triggerChange(select);

      setTimeout(() => {

        // Then translate target language
        select.value = lang;
        triggerChange(select);

        setTimeout(() => {
          switching = false;
        }, 400);

      }, 500);

    } else {

      // Already English → switch directly
      select.value = lang;
      triggerChange(select);

      setTimeout(() => {
        switching = false;
      }, 400);
    }
  }

  // ── Button Click Events ───────────────────────────────────────────────
  bar.querySelectorAll('.sq-lang-btn')
    .forEach(btn => {

      btn.addEventListener('click', () => {
        translateTo(
          btn.dataset.lang
        );
      });

    });

  // ── Default Active State ──────────────────────────────────────────────
  setActiveLang('en');

})();
