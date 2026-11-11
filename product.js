document.addEventListener('DOMContentLoaded', async function() {
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id')); 

    if (!productId) {
        document.getElementById('product-container').innerHTML = '<h2 class="text-center">Товар не знайдено</h2>';
        return;
    }

    try {
        // 2. Загружаем базу данных
        const response = await fetch('store_db.json');
        const products = await response.json();

       
        const product = products.find(p => p.id === productId);

        if (!product) {
            document.getElementById('product-container').innerHTML = '<h2 class="text-center">Товар не знайдено</h2>';
            return;
        }

    
        const container = document.getElementById('product-container');
        container.innerHTML = `
            <div class="row bg-white p-4 rounded-4 shadow-sm">
                <!-- Левая часть: Картинка -->
                <div class="col-md-6 mb-4 mb-md-0 text-center">
                    <img src="${product.image}" alt="${product.title}" class="img-fluid rounded-3" style="max-height: 400px; object-fit: contain;">
                </div>
                
                <!-- Правая часть: Информация -->
                <div class="col-md-6 d-flex flex-column justify-content-center">
                    <p class="text-muted mb-1">${product.category}</p>
                    <h1 class="fw-bold mb-3">${product.title}</h1>
                    <h2 class="text-warning fw-bold mb-4">${product.price.toLocaleString()} ₴</h2>
                    <p class="mb-4">${product.description}</p>
                    
                    <button class="btn btn-warning btn-lg fw-bold py-3 mt-auto" onclick="addToCartGlobal(${product.id})">
                        Додати в кошик 🛒
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Помилка:", error);
        document.getElementById('product-container').innerHTML = '<h2 class="text-center text-danger">Помилка завантаження</h2>';
    }
});