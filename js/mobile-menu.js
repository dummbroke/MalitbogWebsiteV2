document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-button');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.dropdown');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

  // Toggle mobile menu
  mobileMenuBtn.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Handle dropdowns on mobile
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdown = this.closest('.dropdown');
        
        // Close other dropdowns
        dropdowns.forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      const isClickInsideMenu = navMenu.contains(e.target);
      const isClickOnButton = mobileMenuBtn.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnButton) {
        navMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
      }
    }
  });

  // Prevent clicks inside the menu from closing it
  navMenu.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      e.stopPropagation();
    }
  });

  // Reset menu state on window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      navMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
    }
  });
}); 