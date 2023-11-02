const STORAGE_KEY = 'scroll-position-y';
const windowY = sessionStorage.getItem(STORAGE_KEY) || 0;

window.addEventListener('load', () => {
  window.scrollTo(0, windowY);
});

const handleScroll = () => {
  window.sessionStorage.setItem(STORAGE_KEY, window.scrollY);
};

window.addEventListener('scroll', handleScroll);