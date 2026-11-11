document.addEventListener('DOMContentLoaded', function () {
    var swiper3D = new Swiper('.my3DSwiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        coverflowEffect: {
            rotate: 0,
            stretch: 80,
            depth: 200,
            modifier: 1,
            slideShadows: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

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

    function updateCartUI() {
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
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
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