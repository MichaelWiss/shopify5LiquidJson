document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {
  const cartCount = document.querySelector('.site-header__cart-count');
  if (cartCount && Number(cartCount.textContent) > 0) {
    cartCount.removeAttribute('hidden');
  }
});
