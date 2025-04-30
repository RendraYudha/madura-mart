$(document).ready(function() {
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
            console.log('Data mentah dari server:', data); // Debugging
            
            // Cek apakah properti produk ada dan merupakan array
            if (!data.produk || !Array.isArray(data.produk)) {
                throw new Error('Format data tidak valid - properti "produk" harus ada dan berupa array');
            }
            
            console.log('Daftar produk:', data.produk); // Debugging
            
            // Cari produk dengan konversi tipe data untuk memastikan match
            const product = data.produk.find(p => {
                console.log(`Membandingkan: ${p.id} (${typeof p.id}) dengan ${productId} (${typeof productId})`);
                return String(p.id) === String(productId);
            });
            
            if (product) {
                displayProduct(product);
            } else {
                showError(`Produk dengan ID ${productId} tidak ditemukan dalam ${data.produk.length} produk yang tersedia`);
            }
        })
        .fail(function(jqXHR, textStatus, error) {
            showError('Gagal memuat data produk: ' + textStatus);
            console.error('Detail error:', error, jqXHR);
        });

    function displayProduct(product) {
        currentProduct = product; // Simpan produk saat ini
        // Format harga
        const formattedPrice = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(product.harga);
        
        // Update elemen HTML
        $('#product-image').attr('src', product.gambar).attr('alt', product.nama);
        $('#product-name').text(product.nama);
        $('#product-price').text(formattedPrice);
        $('#product-description').text(product.deskripsi || 'Deskripsi tidak tersedia');
        $('#product-stock').text(product.stok > 0 ? `Tersedia (${product.stok})` : 'Kosong');
        $('#product-category').text(product.kategori || 'Umum');
        
        // Tampilkan diskon jika ada
        if (product.diskon && product.diskon > 0) {
            const originalPrice = product.harga_asli ? new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
            }).format(product.harga_asli) : '';
            
            $('#product-discount').html(`
                <span class="badge bg-danger me-2">Diskon ${product.diskon}%</span>
                ${originalPrice ? `<span class="text-muted text-decoration-line-through">${originalPrice}</span>` : ''}
            `).show();
        } else {
            $('#product-discount').hide();
        }

        // Atur kuantitas maksimal
        $('.quantity-input').attr('max', product.stok).val(Math.min(1, product.stok));
        
        // Sembunyikan loading, tampilkan konten
        $('.loading').hide();
        $('.product-content').fadeIn();
    }

    function showError(message) {
        $('#product-container').html(`
            <div class="alert alert-danger text-center py-5">
                <h4 class="alert-heading">Terjadi Kesalahan</h4>
                <p>${message}</p>
                <hr>
                <a href="produk.html" class="btn btn-outline-danger">
                    <i data-feather="arrow-left" class="me-2"></i>Kembali ke Daftar Produk
                </a>
            </div>
        `);
        $('.loading').hide();
    }
});