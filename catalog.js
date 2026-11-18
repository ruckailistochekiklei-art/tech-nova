document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    const titleEl = document.getElementById('catalog-title');
    const container = document.getElementById('catalog-container');
    
    if (!container) return;

    if (search) {
        titleEl.textContent = `Результати пошуку: "${search}"`;
        container.innerHTML = '';

        const databases = [
            { file: 'phones_db.json', path: 'img/phones', type: 'phone' },
            { file: 'cameras_db.json', path: 'img/cameras', type: 'camera' },
            { file: 'watches_db.json', path: 'img/watches', type: 'watch' },
            { file: 'powerbanks_db.json', path: 'img/powerbanks', type: 'powerbank' },
            { file: 'headphones_db.json', path: 'img/headphones', type: 'headphone' },
            { file: 'consoles_db.json', path: 'img/consoles', type: 'console' },
            { file: 'laptops_db.json', path: 'img/laptops', type: 'laptop' },
            { file: 'mice_db.json', path: 'img/mice', type: 'mouse' },
            { file: 'monitors_db.json', path: 'img/monitors', type: 'monitor' },
            { file: 'speakers_db.json', path: 'img/speakers', type: 'speaker' },
            { file: 'keyboards_db.json', path: 'img/keyboards', type: 'keyboard' },
            { file: 'tvs_db.json', path: 'img/tvs', type: 'tv' },
            { file: 'projectors_db.json', path: 'img/projectors', type: 'projector' },
            { file: 'microphones_db.json', path: 'img/microphones', type: 'microphone' },
            { file: 'washing_machines_db.json', path: 'img/washing_machines', type: 'washing_machine' },
            { file: 'stoves_db.json', path: 'img/stoves', type: 'stove' }
        ];

        let allFound = [];

        for (const db of databases) {
            try {
                const response = await fetch(db.file);
                if (!response.ok) continue; 
                const products = await response.json();
                
                const found = products.filter(p => 
                    p.title.toLowerCase().includes(search.toLowerCase())
                );
                
                found.forEach(p => {
                    p._type = db.type;
                    p._folderPath = db.path;
                    allFound.push(p);
                });
            } catch (e) {
                console.warn(`Не удалось загрузить ${db.file}`);
            }
        }

        if (allFound.length === 0) {
            container.innerHTML = '<h4 class="text-center text-muted w-100">Нічого не знайдено за запитом</h4>';
            return;
        }

        allFound.forEach(product => {
            const imagePath = product.folder ? `${product._folderPath}/${product.folder}/1.jpg` : product.image;
            
            container.innerHTML += `
                <div class="col-md-3 mb-4">
                    <div class="product-card-custom h-100 p-3 bg-white rounded-4 position-relative d-flex flex-column border">
                        <a href="product.html?id=${product.id}&type=${product._type}" class="text-decoration-none text-center d-flex flex-column align-items-center flex-grow-1 mt-2">
                            <img src="${imagePath}" class="card-img-top mb-3" style="height: 180px; object-fit: contain;">
                            <h6 class="text-dark fw-bold mb-2" style="font-size: 13px; height: 36px; overflow: hidden;">${product.title}</h6>
                        </a>
                        <div class="mt-auto">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <div class="text-dark fw-bold fs-5">${product.price.toLocaleString()} ₴</div>
                                <button class="btn btn-light rounded-circle border p-2" onclick="addToCartFromCatalog(${product.id}, '${product._type}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a76d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        return; 
    }

    try {
        let url = 'store_db.json';
        if (category === 'Мобільні') url = 'phones_db.json';
        if (category === 'Фотоапарати') url = 'cameras_db.json';
        if (category === 'Годинники') url = 'watches_db.json';
        if (category === 'Powerbank') url = 'powerbanks_db.json';
        if (category === 'Навушники') url = 'headphones_db.json';
        if (category === 'Ігрові консолі') url = 'consoles_db.json';
        if (category === 'Ноутбуки') url = 'laptops_db.json';
        if (category === 'Мишки') url = 'mice_db.json';
        if (category === 'Монітори') url = 'monitors_db.json';
        if (category === 'Колонки') url = 'speakers_db.json';
        if (category === 'Клавіатури') url = 'keyboards_db.json';
        if (category === 'Телевізори') url = 'tvs_db.json';
        if (category === 'Проектори') url = 'projectors_db.json';
        if (category === 'Мікрофони') url = 'microphones_db.json';
        if (category === 'Пральні машини') url = 'washing_machines_db.json';
        if (category === 'Плити') url = 'stoves_db.json';

        const response = await fetch(url);
        const products = await response.json();
        container.innerHTML = '';

        if (!products || products.length === 0) {
            container.innerHTML = '<h4 class="text-center text-muted w-100">Товарів не знайдено</h4>';
            return;
        }

        let productType = 'other';
        if (category === 'Мобільні') productType = 'phone';
        if (category === 'Фотоапарати') productType = 'camera';
        if (category === 'Годинники') productType = 'watch';
        if (category === 'Powerbank') productType = 'powerbank';
        if (category === 'Навушники') productType = 'headphone';
        if (category === 'Ігрові консолі') productType = 'console';
        if (category === 'Ноутбуки') productType = 'laptop';
        if (category === 'Мишки') productType = 'mouse';
        if (category === 'Монітори') productType = 'monitor';
        if (category === 'Колонки') productType = 'speaker';
        if (category === 'Клавіатури') productType = 'keyboard';
        if (category === 'Телевізори') productType = 'tv';
        if (category === 'Проектори') productType = 'projector';
        if (category === 'Мікрофони') productType = 'microphone';
        if (category === 'Пральні машини') productType = 'washing_machine';
        if (category === 'Плити') productType = 'stove';

        let folderPath = 'img/phones';
        if (category === 'Фотоапарати') folderPath = 'img/cameras';
        if (category === 'Годинники') folderPath = 'img/watches';
        if (category === 'Powerbank') folderPath = 'img/powerbanks';
        if (category === 'Навушники') folderPath = 'img/headphones';
        if (category === 'Ігрові консолі') folderPath = 'img/consoles';
        if (category === 'Ноутбуки') folderPath = 'img/laptops';
        if (category === 'Мишки') folderPath = 'img/mice';
        if (category === 'Монітори') folderPath = 'img/monitors';
        if (category === 'Колонки') folderPath = 'img/speakers';
        if (category === 'Клавіатури') folderPath = 'img/keyboards';
        if (category === 'Телевізори') folderPath = 'img/tvs';
        if (category === 'Проектори') folderPath = 'img/projectors';
        if (category === 'Мікрофони') folderPath = 'img/microphones';
        if (category === 'Пральні машини') folderPath = 'img/washing_machines';
        if (category === 'Плити') folderPath = 'img/stoves';

        products.forEach((product) => {
            const imagePath = product.folder ? `${folderPath}/${product.folder}/1.jpg` : product.image;

            container.innerHTML += `
                <div class="col-md-3 mb-4">
                    <div class="product-card-custom h-100 p-3 bg-white rounded-4 position-relative d-flex flex-column border">
                        <a href="product.html?id=${product.id}&type=${productType}" class="text-decoration-none text-center d-flex flex-column align-items-center flex-grow-1 mt-2">
                            <img src="${imagePath}" class="card-img-top mb-3" style="height: 180px; object-fit: contain;">
                            <h6 class="text-dark fw-bold mb-2" style="font-size: 13px; height: 36px; overflow: hidden;">${product.title}</h6>
                        </a>
                        <div class="mt-auto">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <div>
                                    ${product.oldPrice ? `<div class="text-muted small text-decoration-line-through">${product.oldPrice} ₴</div>` : ''}
                                    <div class="text-dark fw-bold fs-5">${product.price.toLocaleString()} ₴</div>
                                </div>
                                <button class="btn btn-light rounded-circle border p-2" onclick="addToCartFromCatalog(${product.id}, '${productType}')">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a76d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Помилка:", error);
    }
});

window.addToCartFromCatalog = async function(id, type) {
    let url = 'store_db.json';
    let folderPath = '';
    
    if (type === 'phone') { url = 'phones_db.json'; folderPath = 'img/phones'; }
    if (type === 'camera') { url = 'cameras_db.json'; folderPath = 'img/cameras'; }
    if (type === 'watch') { url = 'watches_db.json'; folderPath = 'img/watches'; }
    if (type === 'powerbank') { url = 'powerbanks_db.json'; folderPath = 'img/powerbanks'; }
    if (type === 'headphone') { url = 'headphones_db.json'; folderPath = 'img/headphones'; }
    if (type === 'console') { url = 'consoles_db.json'; folderPath = 'img/consoles'; }
    if (type === 'laptop') { url = 'laptops_db.json'; folderPath = 'img/laptops'; }
    if (type === 'mouse') { url = 'mice_db.json'; folderPath = 'img/mice'; }
    if (type === 'monitor') { url = 'monitors_db.json'; folderPath = 'img/monitors'; }
    if (type === 'speaker') { url = 'speakers_db.json'; folderPath = 'img/speakers'; }
    if (type === 'keyboard') { url = 'keyboards_db.json'; folderPath = 'img/keyboards'; }
    if (type === 'tv') { url = 'tvs_db.json'; folderPath = 'img/tvs'; }
    if (type === 'projector') { url = 'projectors_db.json'; folderPath = 'img/projectors'; }
    if (type === 'microphone') { url = 'microphones_db.json'; folderPath = 'img/microphones'; }
    if (type === 'washing_machine') { url = 'washing_machines_db.json'; folderPath = 'img/washing_machines'; }
    if (type === 'stove') { url = 'stoves_db.json'; folderPath = 'img/stoves'; }

    const response = await fetch(url);
    const products = await response.json();
    const product = products.find(p => p.id === id);

    if (product) {
        const imagePath = product.folder ? `${folderPath}/${product.folder}/1.jpg` : product.image;
        if (window.addToCart) {
            window.addToCart({ id: product.id, name: product.title, price: product.price, img: imagePath });
        }
    }
};