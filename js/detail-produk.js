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
        $('#product-category').text(product.kategori || 'Kategori tidak tersedia');
        $('#addToCart').attr('data-id', product.id).attr('data-nama', product.nama).attr('data-harga', product.harga).attr('data-gambar', product.gambar);
        
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

$(document).on('click', '.btn-add-to-cart', function(e) {
    e.preventDefault();

    // Get data atribut dari atribut tombol
    const productId = parseInt($(this).data('id'));
    const productName = $(this).data('nama');
    const productPrice = parseFloat($(this).data('harga'));
    const productImage = $(this).data('gambar');
    const quantity = parseInt($('.quantity-input').val()) || 1; // Default 1 jika hasilnya NaN

    console.log('Tombol diklik');

    // 2. Ambil atau inisialisasi cart dari sessionStorage
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    // 3. Cek apakah produk sudah ada di cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Jika sudah ada, tambah quantity
        existingItem.quantity += 1;
        console.log('Produk sudah ada, quantity ditambah:', existingItem);
    } else {
        // Jika belum ada, tambahkan produk baru
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: quantity
        });
        console.log('Produk baru ditambahkan ke cart:', cart[cart.length-1]);
    }

    // 3. **PASTIKAN SERVICE FEE DITAMBAHKAN** 
    const SERVICE_FEE_ID = "service-fee";
    const hasServiceFee = cart.some(item => item.id === SERVICE_FEE_ID);
    
    if (!hasServiceFee && cart.length > 0) {
        cart.push({
            id: SERVICE_FEE_ID,
            name: "Biaya Layanan",
            price: 4000,
            quantity: 1,
            isServiceFee: true,
            hidden: true  // Flag untuk UI
        });
        console.log("✅ Biaya layanan ditambahkan!");
    }

    // 4. Simpan ke sessionStorage
    try {
        sessionStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart disimpan ke sessionStorage:', cart);
        
        // 5. Update tampilan cart
        updateCartBadge();
        showToast('Produk ditambahkan ke keranjang');
        
        // 6. Animasi feedback
        // $(this).html('<i data-feather="shopping-cart"></i> Ditambahkan');
        // $(this).prop('disabled', true);
        
        // setTimeout(() => {
        //     $(this).html('<i data-feather="shopping-cart"></i> Tambah ke Keranjang');
        //     $(this).prop('disabled', false);
        // }, 1000);

        // Inisialisasi ulang Feather Icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
    } catch (error) {
        console.error('Gagal menyimpan ke localStorage:', error);
        showToast('Gagal menambahkan produk', 'error');
    }
});

// FUNGSI PENDUKUNG
function updateCartBadge() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $('#cartBadge').text(totalItems).toggle(totalItems > 0);
}

function showToast(message, type = 'success') {
    const toast = $(`<div class="cart-toast ${type}">${message}</div>`);
    $('body').append(toast);
    setTimeout(() => toast.fadeOut(() => toast.remove()), 2000);
}