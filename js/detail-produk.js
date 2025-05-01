$(document).ready(function() {
    // Variabel untuk menyimpan produk saat ini
    let currentProduct = null;

    // [BARU] Fungsi untuk menghitung diskon
    function calculateDiscount(originalPrice, discountedPrice) {
        if (!originalPrice || originalPrice <= discountedPrice) return 0;
        const discountAmount = originalPrice - discountedPrice;
        return Math.round((discountAmount / originalPrice) * 100);
    }

    // Ambil ID produk dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showError('ID Produk tidak ditemukan di URL');
        return;
    }

    // Muat data produk dari JSON
    $.getJSON('data/produk.json')
        .done(function(data) {
            console.log('Data mentah dari server:', data);
            
            if (!data.produk || !Array.isArray(data.produk)) {
                throw new Error('Format data tidak valid - properti "produk" harus ada dan berupa array');
            }
            
            const product = data.produk.find(p => String(p.id) === String(productId));
            
            if (product) {
                displayProduct(product);
            } else {
                showError(`Produk tidak ditemukan`);
            }
        })
        .fail(function(jqXHR, textStatus, error) {
            showError('Gagal memuat data produk');
            console.error('Error:', error);
        });

    // [DIMODIFIKASI] Fungsi untuk menampilkan produk
    function displayProduct(product) {
        currentProduct = product;
        
        // [BARU] Hitung diskon
        const discountPercentage = product.harga_asli ? 
            calculateDiscount(product.harga_asli, product.harga) : 0;
        
        // Format harga
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(product.harga);
        
        // Update elemen HTML
        $('#product-image').attr('src', product.gambar).attr('alt', product.nama);
        $('#product-name').text(product.nama);
        $('#product-price').text(formattedPrice);
        $('#product-description').text(product.deskripsi || 'Deskripsi tidak tersedia');
        $('#product-stock').text(product.stok > 0 ? `Tersedia (${product.stok})` : 'Kosong');
        $('#product-category').text(product.kategori || 'Umum');
        
        // [DIMODIFIKASI] Tampilkan diskon jika ada
        if (discountPercentage > 0) {
            const originalPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(product.harga_asli);
            
            $('#product-discount').html(`
                <span class="badge bg-danger me-2">Diskon ${discountPercentage}%</span>
                <span class="text-muted text-decoration-line-through">${originalPrice}</span>
            `).show();
        } else {
            $('#product-discount').hide();
        }

        // Atur kuantitas maksimal
        $('.quantity-input').attr('max', product.stok).val(Math.min(1, product.stok));
        
        // Sembunyikan loading, tampilkan konten
        $('.loading').hide();
        $('.product-content').fadeIn();
        
        // Inisialisasi Feather Icons
        feather.replace();
    }

    function showError(message) {
        $('#product-container').html(`
            <div class="alert alert-danger text-center py-5">
                <h4 class="alert-heading">Terjadi Kesalahan</h4>
                <p>${message}</p>
                <hr>
                <a href="product.html" class="btn btn-outline-danger">
                    <i data-feather="arrow-left" class="me-2"></i>Kembali ke Daftar Produk
                </a>
            </div>
        `);
        $('.loading').hide();
        feather.replace();
    }
});