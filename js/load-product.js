$(document).ready(function() {
    // Fungsi untuk memuat dan menampilkan produk
    function loadProducts() {
        $.getJSON('data/produk.json')
            .done(function(data) {
                if (!data.produk || !Array.isArray(data.produk)) {
                    showError('Format data produk tidak valid');
                    return;
                }

                if (data.produk.length === 0) {
                    showEmptyMessage();
                    return;
                }

                renderProducts(data.produk);
            })
            .fail(function(jqXHR, textStatus, error) {
                showError('Gagal memuat data produk: ' + textStatus);
                console.error('Error:', error);
            });
    }

    // Fungsi untuk menghitung persentase diskon
    function calculateDiscountPercentage(hargaAsli, hargaDiskon) {
        if (!hargaAsli || hargaAsli <= hargaDiskon) return 0;
        const diskon = hargaAsli - hargaDiskon;
        const persentase = Math.round((diskon / hargaAsli) * 100);
        return persentase;
    }

    // Modifikasi bagian render product card
    function renderProducts(products) {
        const $productsContainer = $('#products-container');
        $productsContainer.empty();

        products.forEach(product => {
            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(product.harga);

            const hargaAsliFormatted = product.harga_asli ? 
                new Intl.NumberFormat('id-ID', { 
                    style: 'currency', 
                    currency: 'IDR' 
                }).format(product.harga_asli) : '';

            // Hitung diskon jika ada harga_asli
            const diskonPercentage = product.harga_asli ? 
                calculateDiscountPercentage(product.harga_asli, product.harga) : 0;

            const productCard = `
                <div class="col-md-4 col-lg-2 mb-4">
                    <div class="card h-100 product-card">
                        <a href="detail-produk.html?id=${product.id}" class="text-decoration-none text-dark card-link">
                            ${diskonPercentage > 0 ? 
                                `<span class="badge bg-danger position-absolute top-0 end-0 m-2">
                                    -${diskonPercentage}%
                                </span>` : ''}
                            <img src="${product.gambar}" class="card-img-top p-3" alt="${product.nama}">
                            <div class="card-body d-flex flex-column">
                                <div class="mt-auto">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="small ${product.stok > 0 ? 'text-success' : 'text-danger'}">
                                            ${product.stok > 0 ? 'Tersedia' : 'Habis'}
                                        </span>
                                    </div>
                                </div>
                                <h5 class="card-title">${product.nama}</h5>
                                <div class="mb-2">
                                    <span class="text-success fw-bold">${formattedPrice}</span>
                                </div>
                            </div>
                        </a>
                        <div class="card-footer bg-transparent border-top-0">
                            <button class="btn btn-sm btn-outline-success w-100 add-to-cart" ${product.stok <= 0 ? 'disabled' : ''}>
                                <i data-feather="shopping-cart" class="me-1"></i> Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            `;

            $productsContainer.append(productCard);
        });

        feather.replace();
        
        $('.add-to-cart').click(function(e) {
            e.stopPropagation();
            const productId = $(this).closest('.product-card').data('id');
            addToCart(productId, 1);
        });
    }

    // Fungsi untuk menambahkan ke keranjang
    function addToCart(productId, quantity) {
        // Simpan ke localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id: productId, quantity: quantity });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Tampilkan notifikasi
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Produk telah ditambahkan ke keranjang',
            showConfirmButton: false,
            timer: 1500
        });
    }

    // Fungsi untuk menampilkan pesan error
    function showError(message) {
        $('#products-container').html(`
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger">
                    <i data-feather="alert-triangle" class="me-2"></i>
                    ${message}
                </div>
                <button class="btn btn-primary mt-3" onclick="loadProducts()">
                    <i data-feather="refresh-cw" class="me-2"></i>Coba Lagi
                </button>
            </div>
        `);
        feather.replace();
    }

    // Fungsi untuk menampilkan pesan kosong
    function showEmptyMessage() {
        $('#products-container').html(`
            <div class="col-12 text-center py-5">
                <div class="alert alert-info">
                    <i data-feather="info" class="me-2"></i>
                    Maaf, produk tidak tersedia saat ini.
                </div>
            </div>
        `);
        feather.replace();
    }

    // Panggil fungsi untuk memuat produk
    loadProducts();
});