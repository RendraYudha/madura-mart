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
    
    // Get data produk dari atribut tombol
    const productId = parseInt($(this).data('id'));
    const productName = $(this).data('nama');
    const productPrice = parseFloat($(this).data('harga'));
    const productImage = $(this).data('gambar');
    
    console.log('Produk diklik:', { productId, productName, productPrice }); // Debug
    
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
            quantity: 1
        });
        console.log('Produk baru ditambahkan ke cart:', cart[cart.length-1]);
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
// function renderCartPage() {
//     const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
//     const cartContainer = $('#cartItems');
//     const subtotalContainer = $('#subtotalProduct');
    
//     cartContainer.empty();
    
//     if (cart.length === 0) {
//         cartContainer.html(`
//             <div class="alert alert-info">
//                 Keranjang belanja Anda kosong. <a href="product.html">Kembali berbelanja</a>
//             </div>
//         `);
//         totalContainer.text('Rp 0');
//     } else {
//         let subTotal = 0;
//         let cartHTML = '';
        
//         cart.forEach(item => {
//             const itemsubTotal = item.price * item.quantity;
//             subTotal += itemsubTotal;
            
//             cartHTML += `
                // <div class="cart-item mb-3 p-3 border rounded">
                //     <div class="d-flex gap-3">
                //         <img src="${item.image}" alt="${item.name}" 
                //             class="cart-item-img" width="80">
                //         <div class="flex-grow-1">
                //             <h5>${item.name}</h5>
                //             <div class="row">
                //                 <div class="col-sm-2 col-md-4 col-lg-6">
                //                     <span>Rp ${item.price.toLocaleString('id-ID')} × </span>
                //                     <button class="btn btn-sm btn-outline-secondary decrease-qty" 
                //                             data-id="${item.id}">-</button>
                //                     <span class="mx-2">${item.quantity}</span>
                //                     <button class="btn btn-sm btn-outline-secondary increase-qty" 
                //                             data-id="${item.id}">+</button>
                //                 </div>
                //                 <div class="d-flex col-sm-2 col-md-4 col-lg-6 justify-content-end align-items-center">
                //                     <span class="fw-bold">Rp ${itemsubTotal.toLocaleString('id-ID')}</span>
                //                     <button class="btn btn-sm btn-danger ms-3 remove-item" 
                //                             data-id="${item.id}">
                //                         <i data-feather="trash-2"></i>
                //                     </button>
                //                 </div>
                //             </div>
                //         </div>
                //     </div>
                // </div>
//             `;
//         });
        
//         cartContainer.html(cartHTML);
//         subtotalContainer.text(`Rp${subTotal.toLocaleString('id-ID')}`);
//     }
    
//     // Inisialisasi ulang Feather Icons
//     if (typeof feather !== 'undefined') {
//         feather.replace();
//     }
// }

function renderCartPage() {
    // 1. Ambil data dari storage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const promoCode = sessionStorage.getItem('promoCode') || '';
    
    // 2. Inisialisasi variabel
    let subTotal = 0;
    const serviceFee = 4000;
    let discount = 0;
    let isValidPromo = false; // Flag untuk validitas promo

    // 3. Daftar promo valid
    const validPromos = {
        'DISKON10': 0.1,    // Disc 10%
        'HEMAT20': 0.2,     // Disc 20%
        'CASHBACK5K': 5000,  // Disc flat Rp 5.000
        '66MADURAMART': 0.5        // Disc 50%
    };

    // 4. Handle keranjang kosong
    if (cart.length === 0) {
        $('#cartItems').html(`
            <div class="alert alert-info">
                Keranjang belanja kosong. <a href="product.html">Belanja sekarang</a>
            </div>
        `);
        $('#subtotalProduct, #cartTotal').text('Rp 0');
        $('#discountRow').hide(); // Pastikan baris diskon tersembunyi
        return;
    }

    // 5. Hitung subtotal dan render item
    let cartHTML = '';
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subTotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item mb-3 p-3 border rounded">
                <div class="d-flex gap-3">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img" width="80">
                    <div class="flex-grow-1">
                        <h5>${item.name}</h5>
                        <div class="row">
                            <div class="col-sm-6">
                                <span>Rp ${item.price.toLocaleString('id-ID')}</span>
                                <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.id}">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.id}">+</button>
                            </div>
                            <div class="col-sm-6 d-flex justify-content-end align-items-center">
                                <span class="fw-bold">Rp ${itemTotal.toLocaleString('id-ID')}</span>
                                <button class="btn btn-sm btn-danger ms-3 remove-item" data-id="${item.id}">
                                    <i data-feather="trash-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    // 6. Validasi kode promo
    if (promoCode && validPromos[promoCode]) {
        isValidPromo = true;
        const promo = validPromos[promoCode];
        
        // Hitung diskon
        discount = typeof promo === 'number' && promo < 1 
            ? subTotal * promo      // Diskon persentase
            : promo;                // Diskon nominal
        
        $('#promoMessage')
            .text(`Diskon berhasil diterapkan!`)
            .removeClass('d-none text-danger')
            .addClass('text-success');
    } else if (promoCode) {
        // Kode tidak valid
        $('#promoMessage')
            .text("Kode promo tidak valid")
            .removeClass('d-none text-success')
            .addClass('text-danger');
        sessionStorage.removeItem('promoCode'); // Hapus kode invalid
    }

    // 7. Update tampilan
    $('#cartItems').html(cartHTML);
    $('#subtotalProduct').text(`Rp ${subTotal.toLocaleString('id-ID')}`);
    $('#cartTotal').text(`Rp ${(subTotal + serviceFee - discount).toLocaleString('id-ID')}`);

    const totalTagihan = subTotal + serviceFee - discount;
    $('#total').val(`Rp ${totalTagihan.toLocaleString('id-ID')}`);
    
    // 8. Tampilkan diskon HANYA jika promo valid
    if (isValidPromo) {
        $('#discountValue').text(`-Rp ${discount.toLocaleString('id-ID')}`);
        $('#discountRow').show();
    } else {
        $('#discountRow').hide(); // Pastikan disembunyikan
    }

    // 10. Inisialisasi Feather Icons
    if (typeof feather !== 'undefined') feather.replace();
}

$(document).ready(function() {
    // Hapus kode promo saat halaman dimuat ulang
    sessionStorage.removeItem('promoCode');
    
    // Kemudian render keranjang
    renderCartPage();
});

// Fungsi untuk menerapkan promo (taruh di bagian lain script)
$('#applyPromo').click(function() {
    const promoCode = $('#promoCode').val();
    sessionStorage.setItem('promoCode', promoCode);
    renderCartPage(); // Render ulang keranjang
});

// Fungsi update cart badge (digunakan di semua halaman)
function updateCartBadge() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    $('#cartBadge').text(totalItems).toggle(totalItems > 0);
}

function generateOrderId() {
    // Karakter yang digunakan
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let orderId = '';
    
    // Generate 5 karakter acak
    for (let i = 0; i < 5; i++) {
      orderId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return orderId;
}

const orderIdentification = generateOrderId();
$('#order_id').val(orderIdentification);

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
            let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            cart = cart.filter(i => i.id !== productId);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            renderCartPage();
            updateCartBadge(); // Update badge setelah hapus item
        });
    }

    // Proses pesanan (di cart.html)
    $('#processBtn').on('click', function() {
        // Ambil nilai subtotal dari teks (format: "Rp 20.400" -> 20400)
        const subtotalText = $('#subtotalProduct').text().replace(/\D/g, '');
        const subtotal = parseInt(subtotalText) || 0;

        if (subtotal > 0) {
            $('#checkoutForm').show();
            $(this).hide();
        } else {
            // Tampilkan alert jika keranjang kosong
            alert('Keranjang belanja Anda masih kosong. Silakan tambahkan produk terlebih dahulu!');
        }
    });
    
    // Submit form checkout (di cart.html)
    $('#customerForm').on('submit', async function(e) {
        e.preventDefault();
        
        // Simpan data customer
        const customerData = {
            customerOrderId: $('#order_id').val(),
            customerName: $('#name').val(),
            customerEmail: $('#email').val(),
            customerPhone: $('#phone').val(),
            customerAddress: $('#address').val(),
            customerTagihan: $('#total').val(),
            orderDate: new Date().toISOString()
        };
        
        sessionStorage.setItem('customerData', JSON.stringify(customerData));
        
        const cartItems = JSON.parse(sessionStorage.getItem('cart')) || [];

        try {
            const response = await fetch('php/placeOrder.php', {
                method: 'POST',
                body: JSON.stringify({
                    customer: customerData,
                    items: cartItems
                })
            });
            
            const token = await response.text();
            
            if (token) {
                window.snap.pay(token); // Redirect ke Midtrans
            } else {
                throw new Error('Token pembayaran tidak diterima');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Gagal memproses pembayaran: ' + error.message);
        }

        // Redirect ke halaman pembayaran
        // alert('Pesanan berhasil diproses!');
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
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== productId);
        }
        
        sessionStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        
        if (window.location.pathname.includes('cart.html')) {
            renderCartPage();
        }
    }
}