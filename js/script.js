// Untuk Carousel
$(document).ready(function() {
    // Inisialisasi carousel
    let currentIndex = 0;
    const items = $('#testimoniCarousel .carousel-item');
    const totalItems = items.length;
    
    // Fungsi untuk menampilkan testimoni
    function showTestimoni(index) {
        items.removeClass('active');
        $(items[index]).addClass('active');
        currentIndex = index;
    }
    
    // Auto slide
    let interval = setInterval(nextTestimoni, 5000);
    
    // Fungsi next testimoni
    function nextTestimoni() {
        let nextIndex = (currentIndex + 1) % totalItems;
        showTestimoni(nextIndex);
    }
    
    // Fungsi prev testimoni
    function prevTestimoni() {
        let prevIndex = (currentIndex - 1 + totalItems) % totalItems;
        showTestimoni(prevIndex);
    }
    
    // Tombol next
    $('.carousel-control-next').click(function() {
        clearInterval(interval);
        nextTestimoni();
        interval = setInterval(nextTestimoni, 5000);
    });
    
    // Tombol prev
    $('.carousel-control-prev').click(function() {
        clearInterval(interval);
        prevTestimoni();
        interval = setInterval(nextTestimoni, 5000);
    });
    
    // Pause saat hover
    $('#testimoniCarousel').hover(
        function() {
            clearInterval(interval);
        },
        function() {
            interval = setInterval(nextTestimoni, 5000);
        }
    );
    
    // Animasi transisi
    $('#testimoniCarousel').on('slide.bs.carousel', function () {
        $(this).find('.carousel-item').css('transition', 'transform 0.6s ease-in-out');
    });
});

// Untuk Form Saran
$(document).ready(function() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Ambil data form
        const formData = {
            nama: $('#nama').val(),
            email: $('#email').val(),
            subjek: $('#subjek').val(),
            pesan: $('#pesan').val(),
            newsletter: $('#newsletter').is(':checked')
        };

        // Log data form (untuk debugging)
        console.log('Form submitted:', formData);

        // Tampilkan notifikasi
        alert('Terima kasih atas pesan Anda! Kami akan segera merespon pesan ini.');

        // Reset form
        this.reset();

        // Alternatif menggunakan SweetAlert2 untuk notifikasi lebih menarik:
        /*
        Swal.fire({
            icon: 'success',
            title: 'Terima kasih!',
            text: 'Pesan Anda telah terkirim. Kami akan segera merespon.',
            confirmButtonText: 'OK'
        }).then(() => {
            this.reset();
        });
        */

        // Jika ingin mengirim data via AJAX:
        /*
        $.ajax({
            url: 'process-contact.php',
            method: 'POST',
            data: formData,
            success: function(response) {
                alert('Pesan terkirim: ' + response.message);
                $('#contactForm')[0].reset();
            },
            error: function(xhr, status, error) {
                alert('Error: ' + error);
            }
        });
        */
    });
});

$.getJSON('data/produk.json', function(data) {
    console.log(data)
})

