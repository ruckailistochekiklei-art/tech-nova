
document.addEventListener('DOMContentLoaded', function() {

    updateCartUI();
});

document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('cartOffcanvas')) {
        const cartHTML = `
        <div class="offcanvas offcanvas-end custom-cart" tabindex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel">
            <div class="offcanvas-header pb-0 border-0">
                <h4 class="offcanvas-title fw-bold" id="cartOffcanvasLabel">Ваші замовлення</h4>
                <button type="button" class="btn-close custom-close" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column">
                <div class="custom-tabs mb-4">
                    <button class="tab-btn active">Кошик</button>
                    <button class="tab-btn">Запропонувати знову</button>
                </div>
                <div id="cartContent" class="flex-grow-1 d-flex flex-column"></div>
                <div id="cartFooter" style="display: none;">
                    <div class="border-top pt-3 mt-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="mb-0 text-muted">Разом:</h5>
                            <h5 class="mb-0 fw-bold" id="cartTotal">0 ₴</h5>
                        </div>
                        <button class="btn btn-checkout w-100 fw-bold py-3" onclick="window.location.href='checkout.html'">Оформити замовлення</button>
                    </div>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    window.addToCart = function(product) {
        let cart = getCart();
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        saveCart(cart);
        const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
        cartOffcanvas.show();
    }

    window.removeFromCart = function(productId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
    }

    window.changeQty = function(productId, delta) {
        let cart = getCart();
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== productId);
            }
        }
        saveCart(cart);
    }

    window.updateCartUI = function() {
        const cart = getCart();
        const countEl = document.getElementById('cartCount');
        const contentEl = document.getElementById('cartContent');
        const footerEl = document.getElementById('cartFooter');
        const totalEl = document.getElementById('cartTotal');

        const totalCount = cart.reduce((sum, i) => sum + i.qty, 0);
        if (countEl) countEl.textContent = totalCount;

        if (cart.length === 0) {
            if (footerEl) footerEl.style.display = 'none';
            if (contentEl) {
                contentEl.innerHTML = `
                    <div class="empty-cart">
                        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Порожній кошик">
                        <h3>Замовлень поки немає.</h3>
                        <p>Тут відображаються ваші попередні замовлення, щоб ви могли швидко та легко повторити замовлення.</p>
                        <button class="btn-start-shopping" data-bs-dismiss="offcanvas">Почніть покупки</button>
                    </div>
                `;
            }
            return;
        }

        if (footerEl) footerEl.style.display = 'block';
        
        let html = '';
        let total = 0;
        
        cart.forEach(item => {
            total += item.price * item.qty;
            html += `
                <div class="cart-item">
                    <img src="${item.img || item.image}" alt="${item.name || item.title}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name || item.title}</div>
                        <div class="cart-item-price">${item.price.toLocaleString()} ₴</div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
                            <span>${item.qty}</span>
                            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
                </div>
            `;
        });

        if (contentEl) contentEl.innerHTML = html;
        if (totalEl) totalEl.textContent = total.toLocaleString() + ' ₴';
    }

    updateCartUI();
});