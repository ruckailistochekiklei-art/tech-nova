document.addEventListener('DOMContentLoaded', function() {
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const container = document.getElementById('checkout-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const totalEl = document.getElementById('checkout-total');

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted">Ваш кошик порожній.</p>';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        html += `
            <div class="d-flex align-items-center mb-3">
                <img src="${item.img}" class="rounded me-3" style="width: 60px; height: 60px; object-fit: contain;">
                <div class="flex-grow-1">
                    <h6 class="mb-1" style="font-size: 14px;">${item.name}</h6>
                    <div class="text-muted small">Кількість: ${item.qty}</div>
                </div>
                <div class="fw-bold">${(item.price * item.qty).toLocaleString()} ₴</div>
            </div>
        `;
    });

    container.innerHTML = html;
    subtotalEl.textContent = total.toLocaleString() + ' ₴';
    totalEl.textContent = total.toLocaleString() + ' ₴';
});
window.completeOrder = function() {
    
    alert('Дякуємо! Ваше замовлення успішно оформлено! 🎉');
    
    
    localStorage.removeItem('cart');
    
    
    window.location.href = 'index.html';
};