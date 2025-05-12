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
    
    // if (existingItem) {
    //     // Jika sudah ada, tambah quantity
    //     existingItem.quantity += 1;
    //     console.log('Produk sudah ada, quantity ditambah:', existingItem);
    // } else {
    //     // Jika belum ada, tambahkan produk baru
    //     cart.push({
    //         id: productId,
    //         name: productName,
    //         price: productPrice,
    //         image: productImage,
    //         quantity: 1
    //     });
    //     console.log('Produk baru ditambahkan ke cart:', cart[cart.length-1]);
    // }

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
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
            price: 2000,
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
    const serviceFee = 2000;
    let discount = 0;
    let isValidPromo = false; // Flag untuk validitas promo

    // 3. Daftar promo valid
    // const validPromos = {
    //     'DISKON10': 0.1,    // Disc 10%
    //     'HEMAT20': 0.2,     // Disc 20%
    //     'CASHBACK5K': 5000,  // Disc flat Rp 5.000
    //     '66MADURAMART': 0.5        // Disc 50%
    // };

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
        if (item.isServiceFee) return;
        if (item.isPromo) return;
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
                                <span>Rp ${item.price.toLocaleString('id-ID')} x </span>
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

    // 7. Update tampilan
    $('#cartItems').html(cartHTML);
    $('#subtotalProduct').text(`Rp ${subTotal.toLocaleString('id-ID')}`);
    // $('#cartTotal').text(`Rp ${(subTotal + serviceFee).toLocaleString('id-ID')}`);
    // $('#totalFormatted').val(`Rp ${(subTotal + serviceFee - discount).toLocaleString('id-ID')}`);

    // const totalTagihan = subTotal + serviceFee - discount;
    // $('#total').val(`Rp ${totalTagihan.toLocaleString('id-ID')}`);
    // $('#total').val(totalTagihan);
    
    // 8. Tampilkan diskon HANYA jika promo valid
    // if (isValidPromo) {
    //     $('#discountValue').text(`-Rp ${discount.toLocaleString('id-ID')}`);
    //     $('#discountRow').show();
    // } else {
    //     $('#discountRow').hide(); // Pastikan disembunyikan
    // }

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
// $('#applyPromo').click(function() {
//     const promoCode = $('#promoCode').val();
//     sessionStorage.setItem('promoCode', promoCode);
//     renderCartPage(); // Render ulang keranjang
// });

$('#applyPromo').click( async function() {
    const promoCode = $('#promoCode').val().trim().toUpperCase();
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    // Hapus promo lama jika ada
    cart = cart.filter(item => !item.isPromo);

    // Daftar promo valid
    const validPromos = {
        'DISKON10': { type: 'percentage', value: 10 },
        'HEMAT20': { type: 'percentage', value: 20 },
        'CASHBACK5K': { type: 'fixed', value: 5000 },
        '66MADURAMART': { type: 'percentage', value: 50}
    };

    // Hapus promo sebelumnya jika ada
    const existingPromoIndex = cart.findIndex(item => item.isPromo);
    if (existingPromoIndex !== -1) {
        cart.splice(existingPromoIndex, 1);
    }

    // Validasi promo
    if (promoCode && validPromos[promoCode]) {
        const promo = validPromos[promoCode];
        const subtotal = calculateSubtotal(cart);
        
        // Hitung nilai diskon
        let discountAmount = promo.type === 'percentage' 
            ? (subtotal * (promo.value / 100)) 
            : promo.value;

        // Tambahkan sebagai item cart
        cart.push({
            id: "promo-code",
            name: `Promo (${promoCode})`,
            price: -discountAmount,
            quantity: 1,
            isPromo: true,
            sku: 'DISCOUNT' // Untuk identifikasi Midtrans
        });

        updateCartTotal();
        showToast('Promo berhasil diterapkan!');
        $('#promoMessage')
            .text(`Diskon berhasil diterapkan!`)
            .removeClass('d-none text-danger')
            .addClass('text-success');
        $('#discountValue')
            .text(`-Rp ${discountAmount.toLocaleString('id-ID')}`);
        $('#discountRow')
            .removeClass('d-none');
        sessionStorage.setItem('cart', JSON.stringify(cart));
        sessionStorage.setItem('promoCode', promoCode);
    } else if (promoCode) {
        updateCartTotal();
        showToast('Kode promo tidak valid', 'error');
        $('#promoMessage')
            .text("Kode promo tidak valid")
            .removeClass('d-none text-success')
            .addClass('text-danger');
        $('#discountRow')
            .addClass('d-none');
        // 1. Ambil cart dari sessionStorage
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

        // 2. Filter out item diskon (yang punya isPromo: true)
        const cartWithoutDiscount = cart.filter(item => !item.isPromo);

        // 3. Simpan kembali ke sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cartWithoutDiscount));
        sessionStorage.removeItem('promoCode');
    }

    function calculateSubtotal(cart) {
        return cart.reduce((total, item) => {
            if (item.isPromo || item.isServiceFee) return total;
            return total + (item.price * item.quantity);
        }, 0);
    }

    updateCartTotal();
    renderCartPage();
});

// Saat halaman dimuat, hapus semua promo dari cart
$(document).ready(function() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cleanCart = cart.filter(item => !item.isPromo); // Hapus item promo
    sessionStorage.setItem('cart', JSON.stringify(cleanCart)); // Simpan cart tanpa promo
    
    // Reset tampilan promo
    $('#promoCode').val('');
    $('#discountRow').addClass('d-none');
    $('#promoMessage').addClass('d-none');
});

// 1. Fungsi utilitas untuk menghitung semua nilai
function calculateCartValues() {
    try {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        
        const subtotal = cart.reduce((sum, item) => {
            if (item?.isPromo || item?.isServiceFee) return sum;
            return sum + (item.price * (item.quantity || 1));
        }, 0);

        const serviceFee = cart.find(item => item?.isServiceFee)?.price || 2000;
        const discount = Math.abs(cart.find(item => item?.isPromo)?.price || 0);

        return {
            subtotal,
            serviceFee,
            discount,
            total: subtotal + serviceFee - discount
        };
    } catch (error) {
        console.error("Error in calculateCartValues:", error);
        return { subtotal: 0, serviceFee: 0, discount: 0, total: 0 };
    }
}

// 2. Fungsi update UI dengan debug
function updateCartTotal() {
    console.log("Memperbarui UI..."); // Debug log
    
    const { subtotal } = calculateCartValues();
    console.log("Nilai subtotal:", subtotal); // Debug nilai
    const { discount } = calculateCartValues();
    console.log("Nilai diskon:", discount); // Debug nilai
    const { serviceFee } = calculateCartValues();
    console.log("Nilai layan:", serviceFee); // Debug nilai
    const { total } = calculateCartValues();
    console.log("Nilai total:", total); // Debug nilai
    
    const $totalElement = $('#cartTotal');
    const $totalTagihan = $('#totalTagihan');
    const $totalInteger = $('#totalInteger');
    console.log("Elemen target:", $totalElement); // Debug elemen
    
    if ($totalElement.length) {
        $totalElement.text(`Rp ${total.toLocaleString('id-ID')}`);
        $totalTagihan.val(`Rp ${total.toLocaleString('id-ID')}`);
        $totalInteger.val(total);
    } else {
        console.error("Error: #cartTotal tidak ditemukan!");
    }
}

// 3. Panggil manual untuk testing
$(document).ready(function() {
    console.log("Document ready...");
    updateCartTotal();
});


// Fungsi update cart badge (digunakan di semua halaman)
function updateCartBadge() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    // Filter out service fee dan diskon sebelum menghitung
    const totalItems = cart.reduce((total, item) => {
        if (item.isServiceFee || item.isPromo) {
            return total; // Lewati item ini
        }
        return total + item.quantity;
    }, 0);
    
    $('#cartBadge')
        .text(totalItems)
        .toggle(totalItems > 0);
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
            updateCartTotal();
        });
        
        $(document).on('click', '.decrease-qty', function() {
            const productId = parseInt($(this).data('id'));
            updateQuantity(productId, -1);
            updateCartTotal();
        });
        
        $(document).on('click', '.remove-item', function() {
            const productId = parseInt($(this).data('id'));
            let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            cart = cart.filter(i => i.id !== productId);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            renderCartPage();
            updateCartBadge(); // Update badge setelah hapus item
            updateCartTotal();
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
            customerTagihan: $('#totalInteger').val(),
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
                sessionStorage.clear();
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