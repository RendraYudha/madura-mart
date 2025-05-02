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
                initializeLiveSearch(data.produk); // Inisialisasi live search setelah data dimuat
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

    // Render product card
    function renderProducts(products) {
        const $productsContainer = $('#products-container');
        $productsContainer.empty();

        products.forEach(product => {
            const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0
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
                        <div class="card-footer bg-transparent border-top-0 mt-auto">
                            <button class="btn btn-sm btn-outline-success w-100 add-to-cart" data-id="${product.id}" data-nama="${product.nama}" data-harga="${product.harga}" data-gambar="${product.gambar}" ${product.stok <= 0 ? 'disabled' : ''}>
                                <i data-feather="shopping-cart" class="me-1"></i> Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            `;

            $productsContainer.append(productCard);
        });

        // Inisialisasi ulang Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
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

    // Fungsi untuk inisialisasi live search
    function initializeLiveSearch(products) {
        $('#liveSearch').on('input', function() {
            try {
                const searchTerm = $(this).val().toLowerCase();
                console.log("Search term:", searchTerm);
                
                const filteredProducts = filterProducts(products, searchTerm);
                console.log("Filtered products:", filteredProducts);
                
                renderProducts(filteredProducts);
            } catch (error) {
                console.error("Error in live search:", error);
            }
        });

        console.log("Event listener live search berhasil dipasang");
    }

    // Fungsi untuk memfilter produk
    function filterProducts(products, searchTerm) {
        if (!searchTerm) return products;
        
        return products.filter(product => {
            // Pastikan semua field yang diakses ada nilainya
            return (
                (product.nama && product.nama.toString().toLowerCase().includes(searchTerm)) ||
                // (product.deskripsi && product.deskripsi.toString().toLowerCase().includes(searchTerm)) ||
                (product.kategori && product.kategori.toString().toLowerCase().includes(searchTerm)) ||
                (product.harga && product.harga.toString().includes(searchTerm))
            );
        });
    }

    // Fungsi untuk menampilkan pesan error
    function showError(message) {
        $('#productContainer').html(`
            <div class="col-12 text-center py-5">
                <i data-feather="alert-triangle" class="text-danger" width="48" height="48"></i>
                <h4 class="mt-3">${message}</h4>
            </div>
        `);
        feather.replace();
    }

    // Fungsi untuk menampilkan pesan kosong
    function showEmptyMessage() {
        $('#productContainer').html(`
            <div class="col-12 text-center py-5">
                <i data-feather="package" class="text-muted" width="48" height="48"></i>
                <h4 class="mt-3">Tidak ada produk tersedia</h4>
            </div>
        `);
        feather.replace();
    }

    // Panggil fungsi untuk memuat produk
    loadProducts();
});