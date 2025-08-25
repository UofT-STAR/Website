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
  // Remove any existing notifications
  const existingNotification = document.querySelector('.notification');
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
  
  // Add notification styles
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      min-width: 300px;
      max-width: 500px;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }
    
    .notification.show {
      transform: translateX(0);
    }
    
    .notification-success {
      background: linear-gradient(135deg, #48bb78, #38a169);
      color: white;
    }
    
    .notification-error {
      background: linear-gradient(135deg, #f56565, #e53e3e);
      color: white;
    }
    
    .notification-info {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }
    
    .notification-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 20px;
    }
    
    .notification-message {
      flex: 1;
      font-weight: 500;
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
    }
    
    .notification-close:hover {
      opacity: 1;
    }
  `;
  
  if (!document.querySelector('#notification-styles')) {
    style.id = 'notification-styles';
    document.head.appendChild(style);
  }
  
  // Add to page
  document.body.appendChild(notification);
  
  // Show notification
  requestAnimationFrame(() => {
    notification.classList.add('show');
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

// Add active class to current navigation item based on scroll position
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
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
    
    // Add some fun visual effects
    document.body.style.animation = 'rainbow 2s infinite';
    
    const rainbowStyle = document.createElement('style');
    rainbowStyle.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
    `;
    document.head.appendChild(rainbowStyle);
    
    setTimeout(() => {
      document.body.style.animation = '';
    }, 4000);
    
    konamiCode = [];
  }
});