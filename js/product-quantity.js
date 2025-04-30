$(document).ready(function() {
    let currentProduct = null; // Simpan data produk yang sedang ditampilkan

    // Fungsi untuk update tombol +/- berdasarkan stok
    function updateQuantityControls() {
        if (!currentProduct) return;
        
        const quantityInput = $('.quantity-input');
        const currentValue = parseInt(quantityInput.val());
        const maxStock = currentProduct.stok;
        
        // Update tombol minus
        $('.btn-minus').prop('disabled', currentValue <= 1);
        
        // Update tombol plus
        $('.btn-plus').prop('disabled', currentValue >= maxStock);
        
        // Update input
        quantityInput.prop('max', maxStock);
    }

    // Event handler untuk tombol minus
    $(document).on('click', '.btn-minus', function() {
        const quantityInput = $('.quantity-input');
        let currentValue = parseInt(quantityInput.val());
        if (currentValue > 1) {
            quantityInput.val(currentValue - 1);
            updateQuantityControls();
        }
    });

    // Event handler untuk tombol plus
    $(document).on('click', '.btn-plus', function() {
        const quantityInput = $('.quantity-input');
        let currentValue = parseInt(quantityInput.val());
        if (currentValue < parseInt(quantityInput.attr('max'))) {
            quantityInput.val(currentValue + 1);
            updateQuantityControls();
        }
    });

    // Event handler untuk input manual
    $(document).on('change', '.quantity-input', function() {
        let value = parseInt($(this).val());
        const max = parseInt($(this).attr('max')) || 1;
        const min = parseInt($(this).attr('min')) || 1;
        
        if (isNaN(value)) value = min;
        if (value < min) value = min;
        if (value > max) value = max;
        
        $(this).val(value);
        updateQuantityControls();
    });

    // Dalam fungsi displayProduct, tambahkan:
    function displayProduct(product) {
        currentProduct = product; // Simpan produk saat ini
        
        // ... kode sebelumnya ...
        
        // Inisialisasi kontrol kuantitas
        $('.quantity-input')
            .val(1)
            .attr('max', product.stok)
            .attr('min', 1);
        
        updateQuantityControls(); // Update status tombol
        
        // ... kode setelahnya ...
    }
});