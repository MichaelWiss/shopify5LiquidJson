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

  // Cart item update function
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
          // Close drawer if cart is empty
          closeCartDrawer();
        }
      }
      // Refresh cart drawer content without reload
      refreshCartDrawer();
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
      const submitBtn = form.querySelector('[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';
      
      // Disable button and show loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';
      }
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Fetch updated cart
          const cartResponse = await fetch('/cart.js');
          const cart = await cartResponse.json();
          
          // Update cart count
          if (cartCount) {
            cartCount.textContent = cart.item_count;
            cartCount.removeAttribute('hidden');
          }
          
          // Refresh cart drawer content
          await refreshCartDrawer();
          
          // Open drawer immediately
          openCartDrawer();
          
          // Reset button
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });

  // Function to refresh cart drawer content
  async function refreshCartDrawer() {
    try {
      // Fetch the cart via Shopify's cart.js API
      const cartResponse = await fetch('/cart.js');
      const cart = await cartResponse.json();
      
      // Re-render the cart items
      const drawerContent = document.getElementById('cartDrawerContent');
      if (!drawerContent) return;
      
      if (cart.item_count === 0) {
        drawerContent.innerHTML = `
          <div class="cart-empty">
            <p class="cart-empty__message">Your cart is empty</p>
            <a href="/collections/all" class="cart-btn cart-btn--primary">Continue Shopping</a>
          </div>
        `;
      } else {
        let itemsHTML = '<div class="cart-drawer__items">';
        
        cart.items.forEach((item, index) => {
          const lineNumber = index + 1;
          itemsHTML += `
            <div class="cart-item" data-line-item="${lineNumber}">
              <div class="cart-item__image">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" width="120" height="150" loading="lazy">` : ''}
              </div>
              <div class="cart-item__details">
                <div class="cart-item__header">
                  <h3 class="cart-item__title">${item.product_title}</h3>
                  <div class="cart-item__quantity">
                    <button class="cart-item__qty-btn" data-action="decrease" data-line="${lineNumber}" aria-label="Decrease quantity">−</button>
                    <span class="cart-item__qty-value">${item.quantity}</span>
                    <button class="cart-item__qty-btn" data-action="increase" data-line="${lineNumber}" aria-label="Increase quantity">+</button>
                  </div>
                  <div class="cart-item__price">${formatMoney(item.final_line_price)}</div>
                </div>
                <div class="cart-item__meta">`;
        
          if (item.variant_title && item.variant_title !== 'Default Title') {
            itemsHTML += `<p class="cart-item__option">${item.variant_title}</p>`;
          }
          
          if (item.sku) {
            itemsHTML += `<p class="cart-item__sku">${item.sku}</p>`;
          }
          
          itemsHTML += `
                  <button class="cart-item__remove" data-line="${lineNumber}">Remove</button>
                </div>
              </div>
            </div>
          `;
        });
        
        itemsHTML += '</div>';
        
        itemsHTML += `
          <div class="cart-drawer__footer">
            <div class="cart-drawer__subtotal">
              <span class="cart-drawer__subtotal-label">Subtotal:</span>
              <span class="cart-drawer__subtotal-value">${formatMoney(cart.total_price)}</span>
            </div>
            <div class="cart-drawer__actions">
              <button class="cart-btn cart-btn--secondary" type="button">Add a P.O. Number</button>
              <button class="cart-btn cart-btn--secondary" type="button">Request Quote</button>
              <form action="/cart" method="post">
                <button class="cart-btn cart-btn--primary" type="submit" name="checkout">Checkout</button>
              </form>
            </div>
          </div>
        `;
        
        drawerContent.innerHTML = itemsHTML;
      }
      
      // Reattach event listeners
      attachCartEventListeners();
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  }

  // Format money helper
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  // Function to attach event listeners to cart items
  function attachCartEventListeners() {
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

    // Remove buttons
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const line = this.dataset.line;
        updateCartItem(line, 0);
      });
    });
  }

  // Initial attachment
  attachCartEventListeners();
});

