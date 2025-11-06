document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount && Number(cartCount.textContent) > 0) {
    cartCount.removeAttribute('hidden');
  }

  // Cart Drawer functionality
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawerClose = document.getElementById('cartDrawerClose');
  const cartIcon = document.querySelector('.header-icon[href="/cart"]');

  function openCartDrawer() {
    document.body.classList.add('cart-drawer-open');
    cartDrawer.classList.add('is-open');
    cartOverlay.classList.add('is-visible');
  }

  function closeCartDrawer() {
    document.body.classList.remove('cart-drawer-open');
    cartDrawer.classList.remove('is-open');
    cartOverlay.classList.remove('is-visible');
  }

  // Open drawer when clicking cart icon
  if (cartIcon) {
    cartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  }

  // Close drawer
  if (cartDrawerClose) {
    cartDrawerClose.addEventListener('click', closeCartDrawer);
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCartDrawer);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer.classList.contains('is-open')) {
      closeCartDrawer();
    }
  });

  // Quantity controls
  document.querySelectorAll('.cart-item__qty-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const line = this.dataset.line;
      const action = this.dataset.action;
      const item = this.closest('.cart-item');
      const qtyEl = item.querySelector('.cart-item__qty-value');
      let qty = parseInt(qtyEl.textContent);
      
      if (action === 'increase') {
        qty++;
      } else if (action === 'decrease' && qty > 1) {
        qty--;
      }
      
      updateCartItem(line, qty);
    });
  });

  // Remove button
  document.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const line = this.dataset.line;
      updateCartItem(line, 0);
    });
  });

  function updateCartItem(line, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line: line,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      // Update cart count
      if (cartCount) {
        cartCount.textContent = data.item_count;
        if (data.item_count > 0) {
          cartCount.removeAttribute('hidden');
        } else {
          cartCount.setAttribute('hidden', '');
        }
      }
      // Reload cart drawer content
      fetch('/?section_id=cart-drawer')
        .then(res => res.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newContent = doc.querySelector('.cart-drawer__content');
          if (newContent) {
            document.getElementById('cartDrawerContent').innerHTML = newContent.innerHTML;
            // Reattach event listeners
            location.reload();
          }
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  // Intercept add-to-cart form submissions
  document.querySelectorAll('form[action*="/cart/add"]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Update cart count
          const cartResponse = await fetch('/cart.js');
          const cart = await cartResponse.json();
          
          if (cartCount) {
            cartCount.textContent = cart.item_count;
            cartCount.removeAttribute('hidden');
          }
          
          // Reload and open drawer
          location.reload();
          setTimeout(() => openCartDrawer(), 100);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    });
  });
});

