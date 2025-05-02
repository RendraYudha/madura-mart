// // Fungsi untuk update tampilan cart
// function updateCartUI() {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
//     // Update badge di navbar
//     const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
//     $('#cartBadge').text(totalItems).toggle(totalItems > 0);
    
//     // Jika di halaman cart
//     if (document.getElementById('cartItems')) {
//         renderCartItems(cart);
//     }
// }

// // Render item cart di halaman cart.html
// function renderCartItems(cart) {
//     const cartItems = $('#cartItems');
//     cartItems.empty();
    
//     if (cart.length === 0) {
//         cartItems.html('<p class="text-muted">Keranjang belanja kosong</p>');
//         $('#cartTotal').text('Rp 0');
//         return;
//     }
    
//     let total = 0;
    
//     cart.forEach(item => {
//         total += item.price * item.quantity;
        
//         const itemHtml = `
//             <div class="card mb-3">
//                 <div class="card-body">
//                     <div class="d-flex justify-content-between">
//                         <div>
//                             <h5>${item.name}</h5>
//                             <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</p>
//                         </div>
//                         <div>
//                             <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
//                                 <i class="fas fa-trash"></i>
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//         cartItems.append(itemHtml);
//     });
    
//     $('#cartTotal').text(`Rp ${total.toLocaleString('id-ID')}`);
// }

// // Fungsi untuk menambahkan ke cart
// function addToCart(productId, quantity = 1) {
//     const products = JSON.parse(localStorage.getItem('products')) || [];
//     const product = products.find(p => p.id === productId);
    
//     if (!product) return;
    
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const existingItem = cart.find(item => item.id === productId);
    
//     if (existingItem) {
//         existingItem.quantity += quantity;
//     } else {
//         cart.push({
//             id: product.id,
//             name: product.nama,
//             price: product.harga,
//             image: product.gambar,
//             quantity: quantity
//         });
//     }
    
//     localStorage.setItem('cart', JSON.stringify(cart));
//     updateCartUI();
// }

// // Fungsi untuk menghapus item dari cart
// function removeFromCart(productId) {
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     cart = cart.filter(item => item.id !== productId);
//     localStorage.setItem('cart', JSON.stringify(cart));
//     updateCartUI();
// }

// // Event Listeners
// $(document).ready(function() {
//     // Update cart saat halaman dimuat
//     updateCartUI();
    
//     // Tambah ke cart (di index.html)
//     $(document).on('click', '.add-to-cart', function() {
//         const productId = parseInt($(this).data('id'));
//         addToCart(productId);
//     });
    
//     // Hapus item (di cart.html)
//     $(document).on('click', '.remove-item', function() {
//         const productId = parseInt($(this).data('id'));
//         removeFromCart(productId);
//     });
    
//     // Proses pesanan (di cart.html)
//     $('#processBtn').on('click', function() {
//         $('#checkoutForm').show();
//         $(this).hide();
//     });
    
//     // Submit form checkout (di cart.html)
//     $('#customerForm').on('submit', function(e) {
//         e.preventDefault();
        
//         // Simpan data customer
//         const customerData = {
//             name: $('#name').val(),
//             email: $('#email').val(),
//             phone: $('#phone').val(),
//             address: $('#address').val(),
//             orderDate: new Date().toISOString()
//         };
        
//         localStorage.setItem('customerData', JSON.stringify(customerData));
        
//         // Redirect ke halaman pembayaran
//         alert('Pesanan berhasil diproses!');
//         // window.location.href = 'payment.html';
//     });
// });

// EVENT LISTENER UTAMA UNTUK TOMBOL "TAMBAH KE KERANJANG"
$(document).on('click', '.add-to-cart', function(e) {
    e.preventDefault();
    
    // 1. Ambil data produk dari atribut tombol
    const productId = parseInt($(this).data('id'));
    const productName = $(this).data('nama');
    const productPrice = parseFloat($(this).data('harga'));
    const productImage = $(this).data('gambar');
    
    console.log('Produk diklik:', { productId, productName, productPrice }); // Debug
    
    // 2. Ambil atau inisialisasi cart dari localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
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
            quantity: 1
        });
        console.log('Produk baru ditambahkan ke cart:', cart[cart.length-1]);
    }
    
    // 4. Simpan ke localStorage
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart disimpan ke localStorage:', cart);
        
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
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $('#cartBadge').text(totalItems).toggle(totalItems > 0);
}

function showToast(message, type = 'success') {
    const toast = $(`<div class="cart-toast ${type}">${message}</div>`);
    $('body').append(toast);
    setTimeout(() => toast.fadeOut(() => toast.remove()), 3000);
}

// // FUNGSI UTAMA UNTUK MENAMPILKAN CART
// function renderCartPage() {
//     // 1. Ambil data dari localStorage
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const cartContainer = $('#cartItems');
//     const totalContainer = $('#cartTotal');
    
//     // Kosongkan container
//     cartContainer.empty();
    
//     // 2. Handle jika cart kosong
//     if (cart.length === 0) {
//         cartContainer.html(`
//             <div class="alert alert-info">
//                 Keranjang belanja Anda kosong. <a href="product.html">Kembali berbelanja</a>
//             </div>
//         `);
//         totalContainer.text('Rp 0');
//         return;
//     }
    
//     // 3. Hitung total dan render setiap item
//     let total = 0;
//     let cartHTML = '';
    
//     cart.forEach(item => {
//         const itemTotal = item.price * item.quantity;
//         total += itemTotal;
        
//         cartHTML += `
//             <div class="cart-item mb-3 p-3 border rounded">
//                 <div class="d-flex gap-3">
//                     <img src="${item.image}" alt="${item.name}" 
//                         class="cart-item-img" width="80">
//                     <div class="flex-grow-1">
//                         <h5>${item.name}</h5>
//                         <div class="d-flex justify-content-between align-items-center">
//                             <div>
//                                 <span>Rp ${item.price.toLocaleString('id-ID')} × </span>
//                                 <button class="btn btn-sm btn-outline-secondary decrease-qty" 
//                                         data-id="${item.id}">-</button>
//                                 <span class="mx-2">${item.quantity}</span>
//                                 <button class="btn btn-sm btn-outline-secondary increase-qty" 
//                                         data-id="${item.id}">+</button>
//                             </div>
//                             <div>
//                                 <span class="fw-bold">Rp ${itemTotal.toLocaleString('id-ID')}</span>
//                                 <button class="btn btn-sm btn-danger ms-3 remove-item" 
//                                         data-id="${item.id}">
//                                     <i data-feather="trash-2"></i>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         `;
//     });
    
//     // 4. Update DOM
//     cartContainer.html(cartHTML);
//     totalContainer.text(`Rp ${total.toLocaleString('id-ID')}`);
// }

// // FUNGSI TAMBAHAN UNTUK UPDATE QUANTITY
// function updateQuantity(productId, change) {
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const item = cart.find(i => i.id === productId);
    
//     if (item) {
//         item.quantity += change;
        
//         // Hapus jika quantity <= 0
//         if (item.quantity <= 0) {
//             cart = cart.filter(i => i.id !== productId);
//         }
        
//         localStorage.setItem('cart', JSON.stringify(cart));
//         renderCartPage(); // Render ulang
//     }
// }

// // EVENT LISTENER UNTUK CART PAGE
// $(document).ready(function() {
//     // Jalankan saat halaman cart dimuat
//     if (window.location.pathname.includes('cart.html')) {
//         renderCartPage();
        
//         // Handle tombol quantity
//         $(document).on('click', '.increase-qty', function() {
//             const productId = parseInt($(this).data('id'));
//             updateQuantity(productId, 1);
//         });
        
//         $(document).on('click', '.decrease-qty', function() {
//             const productId = parseInt($(this).data('id'));
//             updateQuantity(productId, -1);
//         });
        
//         // Handle tombol hapus
//         $(document).on('click', '.remove-item', function() {
//             const productId = parseInt($(this).data('id'));
//             let cart = JSON.parse(localStorage.getItem('cart')) || [];
//             cart = cart.filter(i => i.id !== productId);
//             localStorage.setItem('cart', JSON.stringify(cart));
//             renderCartPage();
//         });
//     }
// });

// Fungsi utama untuk render cart
function renderCartPage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = $('#cartItems');
    const totalContainer = $('#cartTotal');
    
    cartContainer.empty();
    
    if (cart.length === 0) {
        cartContainer.html(`
            <div class="alert alert-info">
                Keranjang belanja Anda kosong. <a href="product.html">Kembali berbelanja</a>
            </div>
        `);
        totalContainer.text('Rp 0');
    } else {
        let total = 0;
        let cartHTML = '';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item mb-3 p-3 border rounded">
                    <div class="d-flex gap-3">
                        <img src="${item.image}" alt="${item.name}" 
                            class="cart-item-img" width="80">
                        <div class="flex-grow-1">
                            <h5>${item.name}</h5>
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <span>Rp ${item.price.toLocaleString('id-ID')} × </span>
                                    <button class="btn btn-sm btn-outline-secondary decrease-qty" 
                                            data-id="${item.id}">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary increase-qty" 
                                            data-id="${item.id}">+</button>
                                </div>
                                <div>
                                    <span class="fw-bold">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                                    <button class="btn btn-sm btn-danger ms-3 remove-item" 
                                            data-id="${item.id}">
                                        <i data-feather="trash-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        cartContainer.html(cartHTML);
        totalContainer.text(`Rp ${total.toLocaleString('id-ID')}`);
    }
    
    // Inisialisasi ulang Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}

// Fungsi update cart badge (digunakan di semua halaman)
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $('#cartBadge').text(totalItems).toggle(totalItems > 0);
}

// Event listeners global
$(document).ready(function() {
    // Update cart badge di semua halaman
    updateCartBadge();
    
    // Jika di halaman cart
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
        
        // Event listeners untuk cart page
        $(document).on('click', '.increase-qty', function() {
            const productId = parseInt($(this).data('id'));
            updateQuantity(productId, 1);
        });
        
        $(document).on('click', '.decrease-qty', function() {
            const productId = parseInt($(this).data('id'));
            updateQuantity(productId, -1);
        });
        
        $(document).on('click', '.remove-item', function() {
            const productId = parseInt($(this).data('id'));
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(i => i.id !== productId);
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartPage();
            updateCartBadge(); // Update badge setelah hapus item
        });
    }

    // Proses pesanan (di cart.html)
    $('#processBtn').on('click', function() {
        $('#checkoutForm').show();
        $(this).hide();
    });
    
    // Submit form checkout (di cart.html)
    $('#customerForm').on('submit', function(e) {
        e.preventDefault();
        
        // Simpan data customer
        const customerData = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
            address: $('#address').val(),
            orderDate: new Date().toISOString()
        };
        
        localStorage.setItem('customerData', JSON.stringify(customerData));
        
        // Redirect ke halaman pembayaran
        alert('Pesanan berhasil diproses!');
        // window.location.href = 'payment.html';
    });
    
    // Deteksi perubahan di tab lain
    $(window).on('storage', function(e) {
        if (e.originalEvent.key === 'cart') {
            updateCartBadge();
            if (window.location.pathname.includes('cart.html')) {
                renderCartPage();
            }
        }
    });
});

// Fungsi bantuan untuk update quantity
function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        
        if (window.location.pathname.includes('cart.html')) {
            renderCartPage();
        }
    }
}