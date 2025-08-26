// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

// Enhanced Navbar - Active Section Highlighting
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  const scrollPos = window.scrollY + 100; // Offset for navbar height
  
  // Find the section that's currently most visible
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  // If no section detected, find the closest one
  if (!current) {
    let closest = null;
    let closestDistance = Infinity;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const distance = Math.abs(scrollPos - sectionTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = section.getAttribute('id');
      }
    });
    current = closest;
  }

  // Map section IDs to navbar links (handle special cases)
  let targetLink = current;
  if (current === 'presidents-message') {
    targetLink = 'about'; // President's message should highlight "About" button
  }

  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    if (linkHref === `#${targetLink}`) {
      link.classList.add('active');
    }
  });
}

// Enhanced Navbar - Scroll Effects
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');

function handleNavbarScroll() {
  const currentScrollY = window.scrollY;
  
  // Update active nav link
  updateActiveNavLink();
  
  // Dynamic navbar styling based on scroll using classes
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  
  lastScrollY = currentScrollY;
}

// Add scroll event listener
window.addEventListener('scroll', handleNavbarScroll);

// Enhanced navbar button interactions
document.querySelectorAll('.nav-link').forEach(link => {
  // Add click ripple effect
  link.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(10, 132, 255, 0.6);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    this.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
  
  // Add magnetic effect
  link.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    this.style.transform = `translateY(-3px) scale(1.05) translate(${x * 0.1}px, ${y * 0.1}px)`;
  });
  
  link.addEventListener('mouseleave', function() {
    this.style.transform = '';
  });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// Add logo click animation with improved handling
let logoAnimating = false;
let currentRotation = 0;

document.querySelector('.nav-logo').addEventListener('click', () => {
  if (!logoAnimating) {
    logoAnimating = true;
    const logoImg = document.querySelector('.logo-img');
    
    // Calculate next rotation to always go forward
    currentRotation += 360;
    
    logoImg.style.transform = `rotate(${currentRotation}deg)`;
    logoImg.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      logoAnimating = false;
      // Keep the rotation state, don't reset
    }, 800);
  }
});

// Fix hover interaction - don't interfere with click animation
document.querySelector('.nav-logo').addEventListener('mouseenter', () => {
  if (!logoAnimating) {
    const logoImg = document.querySelector('.logo-img');
    logoImg.style.transform = `rotate(${currentRotation}deg) scale(1.05)`;
    logoImg.style.transition = 'transform 0.3s ease';
  }
});

document.querySelector('.nav-logo').addEventListener('mouseleave', () => {
  if (!logoAnimating) {
    const logoImg = document.querySelector('.logo-img');
    logoImg.style.transform = `rotate(${currentRotation}deg)`;
    logoImg.style.transition = 'transform 0.3s ease';
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar scroll effect - Cool dark theme
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    // Scrolled down - make navbar more solid and add glow effect
    navbar.style.background = 'rgba(13, 17, 23, 0.95)';
    navbar.style.backdropFilter = 'blur(16px)';
    navbar.style.borderBottom = '1px solid rgba(10, 132, 255, 0.3)';
    navbar.style.boxShadow = '0 4px 32px rgba(10, 132, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.3)';
  } else {
    // At top - more transparent and subtle
    navbar.style.background = 'rgba(13, 17, 23, 0.85)';
    navbar.style.backdropFilter = 'blur(8px)';
    navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
    navbar.style.boxShadow = 'none';
  }
});

// Enhanced Intersection Observer for staggered animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animations
      setTimeout(() => {
        entry.target.classList.add('visible');
        
        // Add special animations based on element type
        if (entry.target.classList.contains('feature')) {
          entry.target.style.animationDelay = `${index * 0.2}s`;
        }
        if (entry.target.classList.contains('project-card')) {
          entry.target.style.animationDelay = `${index * 0.3}s`;
        }
        if (entry.target.classList.contains('team-member')) {
          entry.target.style.animationDelay = `${index * 0.15}s`;
        }
      }, index * 100);
    }
  });
}, observerOptions);

// Add fade-in class to elements and observe them with enhanced animations
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.feature, .project-card, .event-item, .team-member');
  animatedElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.animationDelay = `${index * 0.1}s`;
    observer.observe(el);
  });
  
  // Add hover effects to icons
  const icons = document.querySelectorAll('.feature i, .project-icon i');
  icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.2) rotate(10deg)';
      icon.style.color = 'var(--accent)';
    });
    
    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1) rotate(0deg)';
      icon.style.color = 'var(--primary-color)';
    });
  });
  
  // Add floating animation to nav logo
  const navLogo = document.querySelector('.nav-logo i');
  if (navLogo) {
    navLogo.style.animation = 'float 3s ease-in-out infinite';
  }
  
  // Add typing effect to highlight text
  const highlightText = document.querySelector('.highlight');
  if (highlightText) {
    highlightText.addEventListener('mouseenter', () => {
      highlightText.style.animation = 'pulse 1s ease-in-out';
    });
  }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const email = formData.get('email');
  const program = formData.get('program');
  const message = formData.get('message');
  
  // Simple validation
  if (!name || !email || !program || !message) {
    showNotification('Please fill in all fields.', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }
  
  // Simulate form submission
  showNotification('Thank you for your interest! We\'ll get back to you soon.', 'success');
  contactForm.reset();
});

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
  // Remove any existing notifications from container
  const existingNotification = document.querySelector('#notification-container .notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;
  
  // Create isolated container for notification to avoid stacking context issues
  let notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.id = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 999999 !important;
      filter: none !important;
    `;
    document.documentElement.appendChild(notificationContainer);
  }
  
  // Add notification styles
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      z-index: 999999 !important;
      min-width: 300px;
      max-width: 500px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      transform: translateX(100%);
      transition: all 0.3s ease;
      pointer-events: auto;
      
      /* Explicitly inherit the website's font styling */
      font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Arial, sans-serif !important;
      font-size: 14px;
      line-height: 1.6;
      color: white;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification-success {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
      border: 2px solid rgba(72, 187, 120, 0.5);
    }
    
    .notification-error {
      background: linear-gradient(135deg, #f56565, #e53e3e);
      color: white;
      border: 2px solid rgba(245, 101, 101, 0.5);
    }
    
    .notification-info {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: 2px solid rgba(102, 126, 234, 0.5);
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
      font-family: inherit;
    }
    
    .notification-message {
      flex: 1;
      font-weight: 500;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }
    
    .notification-close {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-left: 15px;
      opacity: 0.8;
      transition: opacity 0.2s ease;
      font-family: inherit;
    }
    
    .notification-close:hover {
      opacity: 1;
    }
  `;
  
  if (!document.querySelector('#notification-styles')) {
    style.id = 'notification-styles';
    document.head.appendChild(style);
  }
  
  // Add to isolated container (not body)
  notificationContainer.appendChild(notification);
  
  // Force reflow and show notification
  notification.offsetHeight; // Force reflow
  requestAnimationFrame(() => {
    notification.classList.add('show');
    // Ensure it's visible
    notification.style.display = 'block';
    notification.style.visibility = 'visible';
    notification.style.pointerEvents = 'auto';
  });
  
  // Add close functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroAnimation = document.querySelector('.hero-animation');
  if (heroAnimation) {
    heroAnimation.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Dynamic typing effect for hero title
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Initialize typing effect when page loads
document.addEventListener('DOMContentLoaded', () => {
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    // Uncomment the line below to enable typing effect
    // typeWriter(heroTitle, originalText.replace(/<[^>]*>/g, ''), 50);
  }
});

// Add CSS for active nav link
const activeNavStyle = document.createElement('style');
activeNavStyle.textContent = `
  .nav-link.active {
    color: var(--primary-color);
  }
  
  .nav-link.active::after {
    width: 100%;
  }
`;
document.head.appendChild(activeNavStyle);

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// Smooth reveal animations for sections
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1
});

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
  });
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  
  console.log(e.keyCode, e.key, e.code);

  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (konamiCode.length === konamiSequence.length && 
      konamiCode.every((code, index) => code === konamiSequence[index])) {
    showNotification('🚀 Congratulations! You found the secret space code! Welcome to the elite space cadets!', 'success');
    
    // Add some fun visual effects but exclude the notification
    document.body.style.animation = 'rainbow 2s infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      
      /* Ensure notification stays unaffected by body animations */
      .notification {
        filter: none !important;
        transform: translateX(0) !important;
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 999999 !important;
      }
      
      .notification.show {
        transform: translateX(0) !important;
      }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
      document.body.style.animation = '';
    }, 4000);
    
    konamiCode = [];
  }
});