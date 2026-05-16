// ── Language switching ────────────────────────────────────────────────
let switching = false;

function triggerChange(select) {
  select.dispatchEvent(
    new Event('change', { bubbles: true })
  );
}

function translateTo(lang) {
  if (switching) return;

  const select = document.querySelector('.goog-te-combo');

  if (!select) {
    setTimeout(() => translateTo(lang), 300);
    return;
  }

  const currentLang = select.value || 'en';

  setActiveLang(lang);
  switching = true;

  // English restore
  if (lang === 'en') {
    select.value = 'en';
    triggerChange(select);

    setTimeout(() => {
      switching = false;
    }, 700);

    return;
  }

  // Already in target language
  if (currentLang === lang) {
    switching = false;
    return;
  }

  // Coming from another translated language
  if (currentLang !== 'en') {
    select.value = 'en';
    triggerChange(select);

    setTimeout(() => {
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

bar.querySelectorAll('.sq-lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    translateTo(btn.dataset.lang);
  });
});
