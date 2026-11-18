document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const type = urlParams.get('type');

    if (!productId) {
        document.getElementById('product-container').innerHTML = '<h2 class="text-center">Товар не знайдено</h2>';
        return;
    }

    try {
        let url = 'store_db.json';
        let folderPath = '';

        
        if (type === 'phone') {
            url = 'phones_db.json';
            folderPath = 'img/phones';
        } else if (type === 'camera') {
            url = 'cameras_db.json';
            folderPath = 'img/cameras';
        } else if (type === 'watch') {
            url = 'watches_db.json';
            folderPath = 'img/watches';
        } else if (type === 'powerbank') {
            url = 'powerbanks_db.json';
            folderPath = 'img/powerbanks';
        }
          else if (type === 'headphone') { 
            url = 'headphones_db.json';
            folderPath = 'img/headphones';
        }
          else if (type === 'console') { 
            url = 'consoles_db.json';
            folderPath = 'img/consoles';
        }
         else if (type === 'laptop') { 
            url = 'laptops_db.json';
            folderPath = 'img/laptops';
        }
         else if (type === 'mouse') { 
            url = 'mice_db.json';
            folderPath = 'img/mice';
        } else if (type === 'monitor') { 
            url = 'monitors_db.json';
            folderPath = 'img/monitors';
        } else if (type === 'speaker') { 
            url = 'speakers_db.json';
            folderPath = 'img/speakers';
        } else if (type === 'keyboard') { 
            url = 'keyboards_db.json';
            folderPath = 'img/keyboards';
        } else if (type === 'tv') { 
            url = 'tvs_db.json';
            folderPath = 'img/tvs';
        } else if (type === 'projector') { 
            url = 'projectors_db.json';
            folderPath = 'img/projectors';
        } else if (type === 'microphone') { 
            url = 'microphones_db.json';
            folderPath = 'img/microphones';
        } else if (type === 'washing_machine') { 
            url = 'washing_machines_db.json';
            folderPath = 'img/washing_machines';
        } else if (type === 'stove') { 
            url = 'stoves_db.json';
            folderPath = 'img/stoves';
        }

        const response = await fetch(url);
        const products = await response.json();
        const product = products.find(p => p.id === productId);

        if (!product) {
            document.getElementById('product-container').innerHTML = '<h2 class="text-center">Товар не знайдено</h2>';
            return;
        }

        let mainImage = product.image;
        let galleryHTML = '';

        if (product.folder) {
            mainImage = `${folderPath}/${product.folder}/1.jpg`;
            if (product.photosCount) {
                for (let i = 1; i <= product.photosCount; i++) {
                    const imgPath = `${folderPath}/${product.folder}/${i}.jpg`;
                    galleryHTML += `
                        <img src="${imgPath}" class="img-thumbnail mb-2" style="width: 70px; height: 70px; object-fit: contain; cursor: pointer;" onclick="document.getElementById('mainPhoto').src='${imgPath}'">
                    `;
                }
            }
        } else {
            galleryHTML = `<img src="${mainImage}" class="img-thumbnail mb-2" style="width: 70px; height: 70px; object-fit: contain;">`;
        }

        let specsHTML = '';
        if (product.specs) {
            for (const [key, value] of Object.entries(product.specs)) {
                specsHTML += `<li class="mb-2"><span class="text-muted">${key}:</span> <strong>${value}</strong></li>`;
            }
        }

        const container = document.getElementById('product-container');
        container.innerHTML = `
            <div class="row bg-white p-4 rounded-4 shadow-sm">
                <div class="col-md-6 mb-4 mb-md-0 d-flex">
                    <div class="d-flex flex-column me-3">
                        ${galleryHTML}
                    </div>
                    <div class="flex-grow-1 text-center">
                        <img src="${mainImage}" id="mainPhoto" class="img-fluid rounded-3" style="max-height: 400px; object-fit: contain;">
                    </div>
                </div>
                
                <div class="col-md-6 d-flex flex-column">
                    <h1 class="fw-bold mb-2 fs-3">${product.title}</h1>
                    
                    <div class="d-flex align-items-center mb-4">
                        <h2 class="text-dark fw-bold mb-0 me-3">${product.price.toLocaleString()} ₴</h2>
                        ${product.oldPrice ? `<h4 class="text-muted text-decoration-line-through mb-0">${product.oldPrice.toLocaleString()} ₴</h4>` : ''}
                    </div>

                    <ul class="list-unstyled mb-4" style="font-size: 15px;">
                        ${specsHTML}
                    </ul>
                    
                    <div class="mt-auto">
                        <button class="btn btn-danger w-100 fw-bold py-3 mb-2 fs-5 rounded-3" onclick="addToCartFromProduct(${product.id}, '${type}', '${mainImage}')">
                            Купити 🛒
                        </button>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Помилка:", error);
        document.getElementById('product-container').innerHTML = '<h2 class="text-center text-danger">Помилка завантаження</h2>';
    }
});

window.addToCartFromProduct = function(id, type, image) {
    const titleEl = document.querySelector('.fs-3');
    const priceEl = document.querySelector('.text-dark.fw-bold');
    
    if (!titleEl || !priceEl) return;

    const title = titleEl.textContent.trim();
    const priceText = priceEl.textContent;
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));

    if (window.addToCart) {
        window.addToCart({ 
            id: id, 
            name: title, 
            price: price, 
            img: image 
        });
    }
};