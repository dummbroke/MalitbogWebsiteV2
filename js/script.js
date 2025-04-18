document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle - support both class names for backwards compatibility
  const mobileMenuBtn = document.querySelector('.mobile-menu-button') || document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.dropdown');
  
  // Check if we're on a touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Create overlay for mobile menu if it doesn't exist
  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('menu-overlay');
    document.body.appendChild(overlay);
  }
  
  // Set item indices for staggered animation
  const menuItems = navMenu.querySelectorAll('a, .dropdown');
  menuItems.forEach((item, index) => {
    item.style.setProperty('--item-index', index);
  });
  
  if (mobileMenuBtn) {
    // Toggle mobile menu
    const toggleMenu = function(e) {
      e.stopPropagation();
      mobileMenuBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      if (navMenu.classList.contains('active')) {
        overlay.style.display = 'block';
        setTimeout(() => {
          overlay.style.opacity = '1';
        }, 10);
      } else {
        overlay.style.opacity = '0';
        
        // Reset item animations when menu closes
        menuItems.forEach(item => {
          item.style.transition = 'none';
          item.style.transform = 'translateX(50px)';
          item.style.opacity = '0';
        });
        
        setTimeout(() => {
          overlay.style.display = 'none';
          
          // Re-enable transitions after menu is hidden
          menuItems.forEach(item => {
            item.style.transition = '';
          });
        }, 400);
      }
      
      // Close all dropdowns when toggling menu
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    };
    
    // Add both click and touch events
    mobileMenuBtn.addEventListener('click', toggleMenu);
    if (isTouchDevice) {
      mobileMenuBtn.addEventListener('touchend', function(e) {
        e.preventDefault(); // Prevent default touch behavior
        toggleMenu(e);
      });
    }
  }
  
  // Handle dropdowns with better touch support
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    let hoverTimer;
    let clickActive = false;
    
    if (toggle) {
      // Desktop hover behavior (only on non-touch devices)
      if (window.innerWidth > 768 && !isTouchDevice) {
        dropdown.addEventListener('mouseenter', function() {
          clearTimeout(hoverTimer);
          dropdown.classList.add('hover');
        });
        
        dropdown.addEventListener('mouseleave', function() {
          hoverTimer = setTimeout(() => {
            if (!clickActive) { // Only remove if not activated by click
              dropdown.classList.remove('hover');
            }
          }, 300); // Small delay before hiding
        });
      }
      
      // Click handler for dropdown toggle
      const handleToggleClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isMobile = window.innerWidth <= 768;
        
        // For mobile or touch devices, toggle the active class
        if (isMobile || isTouchDevice) {
          // Close other dropdowns
          dropdowns.forEach(otherDropdown => {
            if (otherDropdown !== dropdown) {
              otherDropdown.classList.remove('active');
            }
          });
          
          // Toggle current dropdown
          clickActive = !dropdown.classList.contains('active');
          dropdown.classList.toggle('active');
        } else {
          // On desktop non-touch, navigate to the first link
          const link = dropdown.querySelector('.dropdown-menu a:first-child');
          if (link) {
            window.location.href = link.getAttribute('href');
          }
        }
      };
      
      // Add both click and touch events to toggle
      toggle.addEventListener('click', handleToggleClick);
      if (isTouchDevice) {
        toggle.addEventListener('touchend', function(e) {
          e.preventDefault(); // Prevent default touch behavior
          handleToggleClick(e);
        });
      }
    }
    
    // Ensure menu stays visible while hovering on the menu itself
    if (menu) {
      if (!isTouchDevice) {
        menu.addEventListener('mouseenter', function() {
          if (window.innerWidth > 768) {
            clearTimeout(hoverTimer);
            dropdown.classList.add('hover');
          }
        });
        
        menu.addEventListener('mouseleave', function() {
          if (window.innerWidth > 768 && !clickActive) {
            hoverTimer = setTimeout(() => {
              dropdown.classList.remove('hover');
            }, 300);
          }
        });
      }
      
      // Handle clicks on menu items
      menu.querySelectorAll('a').forEach(link => {
        const handleLinkClick = function() {
          if (window.innerWidth <= 768 || isTouchDevice) {
            // Close dropdown after clicking a link on mobile/touch
            setTimeout(() => {
              dropdown.classList.remove('active');
              clickActive = false;
            }, 100);
          }
        };
        
        link.addEventListener('click', handleLinkClick);
        if (isTouchDevice) {
          link.addEventListener('touchend', handleLinkClick);
        }
      });
    }
  });
  
  // Close menu when clicking outside
  const closeMenuOnClickOutside = function(e) {
    if (navMenu && !navMenu.contains(e.target) && mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
      navMenu.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      // Close all dropdowns
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
        dropdown.classList.remove('hover');
      });
      
      if (overlay) {
        overlay.style.opacity = '0';
        
        // Reset animations
        menuItems.forEach(item => {
          item.style.transition = 'none';
          item.style.transform = 'translateX(50px)';
          item.style.opacity = '0';
        });
        
        setTimeout(() => {
          overlay.style.display = 'none';
          
          // Re-enable transitions
          menuItems.forEach(item => {
            item.style.transition = '';
          });
        }, 400);
      }
    }
  };
  
  document.addEventListener('click', closeMenuOnClickOutside);
  if (isTouchDevice) {
    document.addEventListener('touchend', function(e) {
      // Only process if it's not on one of our menu elements
      if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-button')) {
        closeMenuOnClickOutside(e);
      }
    });
  }
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      if (navMenu) navMenu.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      if (overlay) {
        overlay.style.opacity = '0';
        
        // Reset animations
        menuItems.forEach(item => {
          item.style.transition = 'none';
          item.style.transform = '';
          item.style.opacity = '';
        });
        
        setTimeout(() => {
          overlay.style.display = 'none';
          
          // Re-enable transitions
          menuItems.forEach(item => {
            item.style.transition = '';
          });
        }, 400);
      }
      
      // Close all dropdowns
      dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
      });
    }
  });
  
  // Close mobile menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-menu a:not(.dropdown-toggle)');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
      document.body.classList.remove('menu-open');
      
      if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 300);
      }
    });
  });

  // Add active class to current page in navigation
  const currentPath = window.location.pathname;
  const pageName = currentPath.split('/').pop();
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if ((linkPath === pageName) || 
        (pageName === '' && linkPath === 'index.html') ||
        (linkPath && pageName && linkPath.endsWith(pageName))) {
      link.classList.add('active');
    }
  });
  
  // Carousel functionality
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;
    
    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }
    
    // Initialize first slide if none are active
    if (!document.querySelector('.carousel-slide.active') && slides.length > 0) {
      slides[0].classList.add('active');
    }
    
    // Change slide every 5 seconds
    setInterval(nextSlide, 5000);
    
    // Add click event to the Explore button
    const exploreBtn = document.querySelector('.explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function() {
        window.location.href = 'pages/tourism.html';
      });
    }
  }
}); 