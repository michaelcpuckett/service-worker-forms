window.addEventListener('pageshow', (event) => {
  const url = new URL(window.location.href);

  if (event.persisted) {
    window.location.reload();
  } else {
    const pathname = url.pathname;
    const filter = url.searchParams.get('filter');
    const query = url.searchParams.get('query');
    const nextUrl = new URL(window.location.origin + pathname);
    if (filter) {
      nextUrl.searchParams.set('filter', filter);
    }
    if (query) {
      nextUrl.searchParams.set('query', query);
    }
    window.history.replaceState({}, '', nextUrl.pathname + nextUrl.search);
  }
});

const STORAGE_KEY = 'scroll-position-y';
const windowY = sessionStorage.getItem(STORAGE_KEY) || 0;

const handleScroll = () => {
  window.sessionStorage.setItem(STORAGE_KEY, window.scrollY);
};

window.addEventListener('scroll', handleScroll);

window.addEventListener('DOMContentLoaded', () => {
  const autofocusElement = window.document.querySelector('[data-auto-focus="true"]');

  console.log(autofocusElement);

  autofocusElement?.focus({
    preventScroll: true,
  });

  window.scrollTo(0, windowY);

  Array.from(window.document.querySelectorAll('form[data-auto-submit] :is([type="checkbox"], [type="radio"])')).forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      inputElement.form.submit();
    });
  });
  
  Array.from(window.document.querySelectorAll('[type="search"]')).forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      if (inputElement.value === '') {
        inputElement.form.submit();
      }
    });
  });

  Array.from(window.document.querySelectorAll('[autofocus]')).forEach((inputElement) => {
    if (!(inputElement instanceof HTMLInputElement)) {
      return;
    }

    if (inputElement.value.length === 0) {
      return;
    }

    if (!(inputElement.type === 'text' || inputElement.type === 'search')) {
      return;
    }

    inputElement.selectionStart = inputElement.selectionEnd = inputElement.value.length;
  });

  Array.from(window.document.querySelectorAll('dialog')).forEach((dialogElement) => {
    dialogElement.addEventListener('click', (event) => {
      if (event.target === event.currentTarget) {
        dialogElement.querySelector('.close-dialog-form').submit();
      }
    });

    dialogElement.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        dialogElement.querySelector('.close-dialog-form').submit();
      }
    });
  });
});