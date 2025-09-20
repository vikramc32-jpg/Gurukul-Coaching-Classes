document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Hero Slider ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    if (slides.length > 0) {
        // Immediately show the first slide
        showSlide(currentSlide);

        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 5000); // Change slide every 5 seconds
    }

    // --- Dropdown Handlers (Desktop Hover & Mobile Click - Direct Style) ---
    const allDropdownParents = document.querySelectorAll('.nav-links .dropdown');

    allDropdownParents.forEach(dropdownParent => {
        const dropdownToggle = dropdownParent.querySelector('a'); // The <a> tag that triggers the dropdown
        const dropdownMenu = dropdownParent.querySelector('.dropdown-menu'); // The actual dropdown menu

        // Desktop Hover Logic
        dropdownParent.addEventListener('mouseenter', () => {
            if (window.innerWidth >= 992) {
                dropdownMenu.style.display = 'block';
            }
        });

        dropdownParent.addEventListener('mouseleave', () => {
            if (window.innerWidth >= 992) {
                dropdownMenu.style.display = 'none';
            }
        });

        // Mobile Click Logic
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth < 992) {
                e.preventDefault(); // Prevent navigation on mobile click

                // Close other open dropdowns
                allDropdownParents.forEach(d => {
                    const otherDropdownMenu = d.querySelector('.dropdown-menu');
                    if (d !== dropdownParent && otherDropdownMenu.style.display === 'block') {
                        otherDropdownMenu.style.display = 'none';
                    }
                });

                // Toggle the current dropdown
                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                } else {
                    dropdownMenu.style.display = 'block';
                }
            } else {
                // On desktop, if dropdown is already open, allow link to be followed
                // If not open, prevent default and open it (first click behavior)
                if (dropdownMenu.style.display !== 'block') {
                    e.preventDefault();
                    dropdownMenu.style.display = 'block';
                }
                // If it is open, a click will follow the link (default behavior)
            }
        });

        // Close dropdowns when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 992 && !dropdownParent.contains(e.target)) {
                const openDropdownMenu = dropdownParent.querySelector('.dropdown-menu');
                if (openDropdownMenu.style.display === 'block') {
                    openDropdownMenu.style.display = 'none';
                }
            }
        });
    });

    // --- Photo Upload Preview ---
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photo-preview');

    if (photoInput && photoPreview) {
        photoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Photo preview disabled as per user request
                };
                reader.readAsDataURL(file);
            } // else block removed as preview is disabled
        });
    }

});


