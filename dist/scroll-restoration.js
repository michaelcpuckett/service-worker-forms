window.addEventListener('pageshow', (event) => {
  const url = new URL(window.location.href);

  if (event.persisted) {
    window.location.reload();
  } else if (url.searchParams.has('state')) {
    const pathname = url.pathname;
    const filter = url.searchParams.get('filter');
    const nextUrl = pathname + (filter ? `?filter=${filter}` : '');
    window.history.replaceState({}, '', nextUrl);
  }
});

const STORAGE_KEY = 'scroll-position-y';
const windowY = sessionStorage.getItem(STORAGE_KEY) || 0;

window.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, windowY);
});

const handleScroll = () => {
  window.sessionStorage.setItem(STORAGE_KEY, window.scrollY);
};

window.addEventListener('scroll', handleScroll);

window.addEventListener('DOMContentLoaded', () => {
  Array.from(window.document.querySelectorAll('form[data-auto-submit] :is([type="checkbox"], [type="radio"])')).forEach((inputElement) => {
    console.log(inputElement);
    inputElement.addEventListener('input', () => {
      inputElement.form.submit();
    });
  });
});