document.addEventListener('DOMContentLoaded', function () {
    
    if (document.querySelector('.myHeroSwiper')) {
        var swiperHero = new Swiper('.myHeroSwiper', {
            loop: true,
            autoplay: { delay: 8000, disableOnInteraction: false },
            navigation: { nextEl: '.myHeroSwiper .swiper-button-next', prevEl: '.myHeroSwiper .swiper-button-prev' },
            pagination: { el: '.myHeroSwiper .swiper-pagination', clickable: true },
            effect: 'slide',
            speed: 800,
        });
    }

    
    if (document.querySelector('.myProductsSwiper')) {
        new Swiper('.myProductsSwiper', {
            loop: true,
            slidesPerView: 2,
            spaceBetween: 20,
            speed: 800,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
            },
            pagination: {
                el: '.myProductsPagination',
                clickable: true,
            },
            breakpoints: {
                768: { slidesPerView: 3, spaceBetween: 20 },
                992: { slidesPerView: 5, spaceBetween: 20 },
                1200: { slidesPerView: 5, spaceBetween: 30 }
            }
        });
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

    updateCartUI();
});