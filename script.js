// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', (e) => {
  e.preventDefault();
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  hamburger.classList.remove('active');
  navMenu.classList.remove('active');
}));

// Close mobile menu when clicking on dropdown links (Constitution page)
document.querySelectorAll('.dropdown-link').forEach(n => n.addEventListener('click', () => {
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

// Add scroll event listener with performance optimization
let ticking = false;

function optimizedScrollHandler() {
  handleNavbarScroll();
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(optimizedScrollHandler);
    ticking = true;
  }
}, { passive: true });

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
    const href = this.getAttribute('href');
    
    // Skip if href is just '#' or empty
    if (!href || href === '#') {
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar scroll effect - Cool dark theme (optimized)
let navbarTicking = false;

function updateNavbarStyle() {
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
  navbarTicking = false;
}

window.addEventListener('scroll', () => {
  if (!navbarTicking) {
    requestAnimationFrame(updateNavbarStyle);
    navbarTicking = true;
  }
}, { passive: true });

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

// Initialize the "Other" program functionality when DOM is loaded
function handleOtherProgramSelection() {
  const otherCheckbox = document.querySelector('input[name="program[]"][value="other"]');
  const checkboxGroup = document.querySelector('.checkbox-group');
  
  if (!otherCheckbox) return;
  
  // Create the "Other" text input container
  const otherInputContainer = document.createElement('div');
  otherInputContainer.className = 'other-program-input';
  otherInputContainer.style.display = 'none';
  otherInputContainer.innerHTML = `
    <input type="text" 
           id="otherProgram" 
           name="otherProgram" 
           placeholder="Enter your programs..."
           style="width: 100%; 
                  padding: 12px; 
                  margin-top: 0.5rem;
                  border: 1px solid var(--border); 
                  border-radius: 8px; 
                  background: var(--glass); 
                  color: var(--ink); 
                  font-size: 0.9rem;">
    <small style="color: var(--muted); 
                  font-size: 0.8rem; 
                  margin-top: 0.25rem; 
                  display: block;">
      Example: Biology, Chemistry, Environmental Science
    </small>
  `;
  
  // Insert after the checkbox group
  checkboxGroup.parentNode.insertBefore(otherInputContainer, checkboxGroup.nextSibling);
  
  // Add event listener to the "Other" checkbox
  otherCheckbox.addEventListener('change', function() {
    const otherInput = document.getElementById('otherProgram');
    
    if (this.checked) {
      // Show the input field with slide down animation
      otherInputContainer.style.display = 'block';
      otherInputContainer.style.maxHeight = '200px'; // Allow enough space for content
      otherInputContainer.style.marginTop = '1rem';
      otherInputContainer.style.padding = '1rem';
      otherInputContainer.style.opacity = '1';
      otherInputContainer.style.transform = 'translateY(0)';
      setTimeout(() => {
        otherInput.focus(); // Auto-focus for better UX
      }, 150);
    } else {
      // Hide the input field with slide up animation
      otherInputContainer.style.maxHeight = '0';
      otherInputContainer.style.marginTop = '0';
      otherInputContainer.style.padding = '0 1rem';
      otherInputContainer.style.opacity = '0';
      otherInputContainer.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        otherInput.value = ''; // Clear the input when hidden
      }, 300);
    }
  });
  
  // Style the input container for smooth slide animation - initially hidden
  otherInputContainer.style.cssText += `
    max-height: 0;
    margin-top: 0;
    padding: 0 1rem;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    display: block;
  `;
  
  // Add focus styling to the input
  const otherInput = otherInputContainer.querySelector('input');
  otherInput.addEventListener('focus', function() {
    this.style.borderColor = 'var(--primary-color)';
    this.style.background = 'var(--glass-hover)';
    this.style.boxShadow = '0 0 0 3px rgba(10, 132, 255, 0.1)';
  });
  
  otherInput.addEventListener('blur', function() {
    this.style.borderColor = 'var(--border)';
    this.style.background = 'var(--glass)';
    this.style.boxShadow = 'none';
  });
}

// Consolidated DOMContentLoaded handler
document.addEventListener('DOMContentLoaded', function() {
  // Initialize back to top button for any page
  initBackToTopButton();
  
  // Initialize Constitution page features
  setupConstitutionSectionObserver();
  
  // Initialize team profile pictures
  loadTeamProfilePictures();
  
  // Initialize trivia game (only on trivia page)
  if (document.getElementById('startBtn')) {
    triviaGame = new TriviaGame();
  }
  
  // Initialize website data manager
  websiteDataManager = new WebsiteDataManager();
  
  // Handle "Other" program selection (index.html contact form)
  handleOtherProgramSelection();
  
  // Add fade-in class to elements and observe them with enhanced animations
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
  
  // Initialize typing effect when page loads
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const originalText = heroTitle.innerHTML;
    // Uncomment the line below to enable typing effect
    // typeWriter(heroTitle, originalText.replace(/<[^>]*>/g, ''), 50);
  }
  
  // Initialize smooth reveal animations for sections
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
  });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Get selected programs including "Other"
    const selectedPrograms = Array.from(document.querySelectorAll('input[name="program[]"]:checked')).map(checkbox => checkbox.value);
    const otherProgram = formData.get('otherProgram');
    
    // Build final programs list
    let finalPrograms = [...selectedPrograms];
    
    // If "Other" is selected and has custom text, replace it with the custom programs
    if (selectedPrograms.includes('other') && otherProgram && otherProgram.trim()) {
      // Remove "other" from the list
      finalPrograms = finalPrograms.filter(program => program !== 'other');
      
      // Split the custom programs by commas and add them
      const customPrograms = otherProgram.split(',').map(program => program.trim()).filter(program => program);
      finalPrograms.push(...customPrograms);
    }
  
  // Simple validation
  if (!name || !email || !finalPrograms.length || !message) {
    showNotification('Please fill in all fields.', 'error');
    return;
  }
  
  // Check if "Other" is selected but no custom program is specified
  if (selectedPrograms.includes('other') && (!otherProgram || !otherProgram.trim())) {
    showNotification('Please specify your program(s) in the "Other" field.', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }
  
  // Show success message with the programs list
  const programsList = finalPrograms.join(', ');
  showNotification(`Thank you ${name}! We received your interest for: ${programsList}. We'll get back to you soon!`, 'success');
  
  // Log the form data for debugging (remove in production)
  console.log('Form submitted:', {
    name,
    email,
    programs: finalPrograms,
    otherProgram,
    message
  });
  
  contactForm.reset();
  
  // Reset the "Other" input field if it exists
  const otherInputContainer = document.querySelector('.other-program-input');
  if (otherInputContainer) {
    otherInputContainer.style.display = 'none';
    const otherInput = document.getElementById('otherProgram');
    if (otherInput) otherInput.value = '';
  }
  });
}

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

// Parallax effect for hero section (optimized)
let parallaxTicking = false;

function updateParallaxEffect() {
  const scrolled = window.pageYOffset;
  const heroAnimation = document.querySelector('.hero-animation');
  if (heroAnimation) {
    heroAnimation.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
  parallaxTicking = false;
}

window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallaxEffect);
    parallaxTicking = true;
  }
}, { passive: true });

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

// Back to top functionality - useful for both index.html and Constitution.html
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Scroll to table of contents (Constitution page specific)
function scrollToTOC() {
  const toc = document.querySelector('.constitution-nav');
  if (toc) {
    toc.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Show/hide back to top button - works for any page with a backToTop element
function initBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    let backToTopTicking = false;
    
    function updateBackToTopButton() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
      backToTopTicking = false;
    }
    
    window.addEventListener('scroll', function() {
      if (!backToTopTicking) {
        requestAnimationFrame(updateBackToTopButton);
        backToTopTicking = true;
      }
    }, { passive: true });
  }
}

// Constitution page: Highlight active section in table of contents and dropdown using Intersection Observer
function setupConstitutionSectionObserver() {
  // Only run on Constitution page
  if (!document.querySelector('.constitution-article')) return;
  
  const sections = document.querySelectorAll('.constitution-article');
  const tocLinks = document.querySelectorAll('.constitution-toc a');
  const dropdownLinks = document.querySelectorAll('.dropdown-link[href^="#article"]');
  
  // console.log(`Constitution observer setup: ${sections.length} sections, ${tocLinks.length} TOC links, ${dropdownLinks.length} dropdown links`);
  
  let currentSection = '';
  
  const observer = new IntersectionObserver((entries) => {
    // Find the section that's most visible
    let maxRatio = 0;
    let mostVisibleSection = '';
    
    entries.forEach(entry => {
      if (entry.intersectionRatio > maxRatio) {
        maxRatio = entry.intersectionRatio;
        mostVisibleSection = entry.target.getAttribute('id');
      }
    });
    
    // Only update if we have a significantly visible section
    if (maxRatio > 0.1) {
      currentSection = mostVisibleSection;
      // console.log(`Active section: ${currentSection}, visibility: ${maxRatio}`);
      
      // Update table of contents
      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
          link.classList.add('active');
          // console.log(`TOC link activated: ${link.getAttribute('href')}`);
        }
      });

      // Update dropdown menu
      dropdownLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
          link.classList.add('active');
          // console.log(`Dropdown link activated: ${link.getAttribute('href')}`);
        }
      });
    }
  }, {
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    rootMargin: '-100px 0px -100px 0px' // Account for navbar
  });
  
  // Observe all sections
  sections.forEach(section => {
    observer.observe(section);
    // console.log(`Observing section: ${section.getAttribute('id')}`);
  });
}

// Team Profile Pictures Loader
const sound = new Audio('TeamExecs/joshua_money.mp3'); // Relevant soundeffect (this is the only sound in the entire website.
function loadTeamProfilePictures() {
  // Add a small delay to ensure dynamically loaded content is ready
  setTimeout(() => {
    const teamMembers = document.querySelectorAll('.team-member');
    if (teamMembers.length === 0) return;
  
  teamMembers.forEach(member => {
    const nameElement = member.querySelector('h3');
    const photoElement = member.querySelector('.member-photo');
    
    if (!nameElement || !photoElement) return;
    
    const fullName = nameElement.textContent.trim();
    const initials = photoElement.textContent.trim(); // Store original initials as fallback
    
    // Convert name to filename format (remove spaces, keep camelCase)
    const filename = fullName.replace(/\s+/g, '');
    
    // Try different image extensions
    const extensions = ['png', 'jpg', 'jpeg', 'webp'];
    let imageLoaded = false;
    
    function tryLoadImage(index) {
      if (index >= extensions.length || imageLoaded) {
        return; // All extensions tried or image already loaded
      }
      
      const ext = extensions[index];
      const imagePath = `TeamExecs/${filename}.${ext}`;
      
      // Create a test image to check if file exists
      const img = new Image();
      
      img.onload = function() {
        // Image loaded successfully
        imageLoaded = true;
        photoElement.style.backgroundImage = `url('${imagePath}')`;
        photoElement.style.backgroundSize = 'cover';
        photoElement.style.backgroundPosition = 'center';
        photoElement.style.backgroundRepeat = 'no-repeat';
        photoElement.textContent = ''; // Remove initials
        photoElement.setAttribute('data-has-image', 'true');
        
        // Add a subtle border to indicate it's a photo
        photoElement.style.border = '2px solid rgba(10, 132, 255, 0.3)';
        photoElement.style.boxShadow = '0 4px 12px rgba(10, 132, 255, 0.2)';
      };
      
      img.onerror = function() {
        // Image failed to load, try next extension
        tryLoadImage(index + 1);
      };
      
      img.src = imagePath;
      if (fullName == "Joshua Chen") {
        member.addEventListener('pointerdown', () => {
          sound.play();
        }) 
      }
    }
    
    // Start trying to load images
    tryLoadImage(0);
    
    // Set a timeout fallback to ensure initials stay if no image loads
    setTimeout(() => {
      if (!imageLoaded) {
        photoElement.textContent = initials; // Keep original initials
        photoElement.setAttribute('data-has-image', 'false');
      }
    }, 2000); // 2 second timeout
    });
  }, 500); // Wait 500ms for dynamic content to load
}

// Trivia Game Functionality
class TriviaGame {
  constructor() {
    this.questions = [];
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.selectedAnswer = null;
    this.startTime = null;
    this.questionStartTime = null;
    this.timeLimit = 30; // seconds per question
    this.timer = null;
    this.shuffledCorrectIndex = 0;
    
    this.init();
  }
  
  init() {
    // Only initialize if we're on the trivia page
    if (!document.getElementById('startBtn')) {
      return;
    }
    
    this.loadQuestions();
    this.bindEvents();
    this.updateStats();
  }
  
  async loadQuestions() {
    try {
      // Use globally loaded data from trivia-questions.js
      if (typeof window.triviaQuestions !== 'undefined') {
        this.questions = [...window.triviaQuestions]; // Copy array to avoid modifying original
        this.shuffleArray(this.questions);
        this.updateStats();
        return;
      }
      
      // Fallback to fetch for HTTP environments
      const response = await fetch('trivia-questions.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.questions = await response.json();
      // Shuffle questions for random order
      this.shuffleArray(this.questions);
      this.updateStats();
    } catch (error) {
      console.error('Error loading trivia questions:', error);
      if (typeof showNotification === 'function') {
        showNotification('Error loading questions. Please refresh the page.', 'error');
      }
      // Fallback: show error message in UI
      const startBtn = document.getElementById('startBtn');
      if (startBtn) {
        startBtn.textContent = 'Error loading questions';
        startBtn.disabled = true;
      }
    }
  }
  
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  bindEvents() {
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }
    
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartGame());
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextQuestion());
    }
  }
  
  updateStats() {
    const totalQuestionsEl = document.getElementById('totalQuestions');
    const currentScoreEl = document.getElementById('currentScore');
    const currentQuestionEl = document.getElementById('currentQuestion');
    
    if (totalQuestionsEl) totalQuestionsEl.textContent = this.questions.length;
    if (currentScoreEl) currentScoreEl.textContent = this.score;
    if (currentQuestionEl) currentQuestionEl.textContent = this.currentQuestionIndex + 1;
  }
  
  startGame() {
    if (this.questions.length === 0) {
      alert('Error: No trivia questions loaded. Please refresh the page.');
      return;
    }
    
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.startTime = Date.now();
    
    // Hide start button, show game elements
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('restartBtn').style.display = 'none';
    document.querySelector('.trivia-progress').style.display = 'block';
    document.getElementById('questionContainer').style.display = 'block';
    document.getElementById('resultsContainer').style.display = 'none';
    
    this.showQuestion();
  }
  
  showQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame();
      return;
    }
    
    const question = this.questions[this.currentQuestionIndex];
    this.selectedAnswer = null;
    this.questionStartTime = Date.now();
    
    // Update progress
    this.updateProgress();
    
    // Display question
    document.getElementById('questionCategory').textContent = question.category;
    const difficultyEl = document.getElementById('questionDifficulty');
    difficultyEl.textContent = question.difficulty;
    difficultyEl.setAttribute('data-difficulty', question.difficulty);
    
    document.getElementById('questionText').textContent = question.question;
    
    // Display answers
    this.displayAnswers(question);
    
    // Start timer
    this.startTimer();
    
    // Hide next button
    document.getElementById('nextBtn').style.display = 'none';
    
    this.updateStats();
  }
  
  displayAnswers(question) {
    const answersGrid = document.getElementById('answersGrid');
    answersGrid.innerHTML = '';
    
    // Create array of answers with their original indices
    const answersWithIndex = question.answers.map((answer, index) => ({
      text: answer,
      originalIndex: index,
      isCorrect: index === question.correct
    }));
    
    // Shuffle the answers
    this.shuffleArray(answersWithIndex);
    
    // Find the new index of the correct answer after shuffling
    this.shuffledCorrectIndex = answersWithIndex.findIndex(item => item.isCorrect);
    
    answersWithIndex.forEach((answerItem, displayIndex) => {
      const answerEl = document.createElement('button');
      answerEl.className = 'answer-option';
      answerEl.setAttribute('data-answer', displayIndex);
      
      answerEl.innerHTML = `
        <div class="answer-letter">${String.fromCharCode(65 + displayIndex)}</div>
        <span>${answerItem.text}</span>
      `;
      
      answerEl.addEventListener('click', () => this.selectAnswer(displayIndex));
      answersGrid.appendChild(answerEl);
    });
  }
  
  selectAnswer(answerIndex) {
    if (this.selectedAnswer !== null) return; // Already answered
    
    this.selectedAnswer = answerIndex;
    this.clearTimer();
    
    const question = this.questions[this.currentQuestionIndex];
    const answerOptions = document.querySelectorAll('.answer-option');
    
    // Disable all options and show correct/incorrect
    answerOptions.forEach((option, index) => {
      option.classList.add('disabled');
      
      if (index === this.shuffledCorrectIndex) {
        option.classList.add('correct');
      } else if (index === answerIndex && index !== this.shuffledCorrectIndex) {
        option.classList.add('incorrect');
      }
      
      if (index === answerIndex) {
        option.classList.add('selected');
      }
    });
    
    // Calculate score
    if (answerIndex === this.shuffledCorrectIndex) {
      this.correctAnswers++;
      const timeBonus = Math.max(0, this.timeLimit - Math.floor((Date.now() - this.questionStartTime) / 1000));
      let points = 100; // Base points
      
      // Difficulty bonus
      if (question.difficulty === 'Medium') points += 50;
      else if (question.difficulty === 'Hard') points += 100;
      
      // Time bonus
      points += timeBonus * 2;
      
      this.score += points;
      
      // Show success feedback
      if (typeof showNotification === 'function') {
        showNotification(`Correct! +${points} points`, 'success');
      }
    } else {
      // Show incorrect feedback with explanation
      if (typeof showNotification === 'function') {
        showNotification(`Incorrect. ${question.explanation}`, 'error');
      }
    }
    
    // Show next button
    setTimeout(() => {
      document.getElementById('nextBtn').style.display = 'inline-block';
    }, 1500);
    
    this.updateStats();
  }
  
  nextQuestion() {
    // Only allow next question if game is active and an answer was selected
    if (!this.startTime || this.currentQuestionIndex >= this.questions.length || this.selectedAnswer === null) {
      return;
    }
    
    this.currentQuestionIndex++;
    this.showQuestion();
  }
  
  updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    // Show progress based on current question being displayed (1-based for display)
    const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    progressFill.style.width = `${progress}%`;
    
    progressText.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
  }
  
  startTimer() {
    let timeLeft = this.timeLimit;
    const timeLeftEl = document.getElementById('timeLeft');
    const timerProgressFill = document.getElementById('timerProgressFill');
    
    // Reset timer progress bar to full
    if (timerProgressFill) {
      timerProgressFill.style.width = '100%';
    }
    
    this.timer = setInterval(() => {
      timeLeft--;
      timeLeftEl.textContent = `${timeLeft}s`;
      
      // Update timer progress bar
      const progressPercentage = (timeLeft / this.timeLimit) * 100;
      if (timerProgressFill) {
        timerProgressFill.style.width = `${progressPercentage}%`;
      }
      
      // Change color when time is running low
      if (timeLeft <= 5) {
        timeLeftEl.style.color = '#ef4444';
      } else if (timeLeft <= 10) {
        timeLeftEl.style.color = '#f59e0b';
      } else {
        timeLeftEl.style.color = 'var(--muted)';
      }
      
      if (timeLeft <= 0) {
        this.selectAnswer(-1); // Auto-select wrong answer for timeout
      }
    }, 1000);
  }
  
  clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  endGame() {
    this.clearTimer();
    
    const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Hide game elements, show results
    document.querySelector('.trivia-progress').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    document.getElementById('restartBtn').style.display = 'inline-block';
    
    // Display results
    document.getElementById('finalScore').textContent = this.score;
    document.getElementById('correctAnswers').textContent = `${this.correctAnswers}/${this.questions.length}`;
    document.getElementById('totalTime').textContent = totalTime;
    
    // Generate results message
    const percentage = (this.correctAnswers / this.questions.length) * 100;
    let message = '';
    
    if (percentage >= 90) {
      message = '🚀 Outstanding! You\'re a true space expert!';
    } else if (percentage >= 80) {
      message = '⭐ Excellent work! Your space knowledge is impressive!';
    } else if (percentage >= 70) {
      message = '🌟 Great job! You know your space stuff!';
    } else if (percentage >= 60) {
      message = '👍 Good effort! Keep exploring the cosmos!';
    } else if (percentage >= 50) {
      message = '📚 Not bad! Time to brush up on space knowledge!';
    } else {
      message = '🌌 Keep learning! The universe has so much to offer!';
    }
    
    document.getElementById('resultsMessage').textContent = message;
    
    this.updateStats();
  }
  
  restartGame() {
    // Shuffle questions again
    this.shuffleArray(this.questions);
    
    // Reset all elements
    document.getElementById('restartBtn').style.display = 'none';
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'none';
    document.querySelector('.trivia-progress').style.display = 'none';
    document.getElementById('questionContainer').style.display = 'none';
    
    // Reset stats
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctAnswers = 0;
    this.updateStats();
  }
}

// Initialize trivia game when DOM loads
let triviaGame;

// Website Data Management
class WebsiteDataManager {
  constructor() {
    this.data = null;
    this.init();
  }
  
  async init() {
    // Only load data if we're on the main page
    if (document.querySelector('.team-grid') || document.querySelector('.projects-grid')) {
      await this.loadData();
      this.populateContent();
    }
  }
  
  async loadData() {
    try {
      // Use globally loaded data from website-data.js
      if (typeof window.websiteData !== 'undefined') {
        this.data = window.websiteData;
        console.log('Using loaded website data from JavaScript module');
        return;
      }
      
      // Fallback to fetch for HTTP environments
      const response = await fetch('website-data.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.data = await response.json();
      console.log('Loaded website data from JSON file');
    } catch (error) {
      console.error('Error loading website data:', error);
      this.showErrorMessage();
      // Fallback: keep existing HTML content
    }
  }
  
  showErrorMessage() {
    // Show error message in loading placeholders
    const placeholders = document.querySelectorAll('.loading-placeholder');
    placeholders.forEach(placeholder => {
      placeholder.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <p>Error loading content. Please refresh the page.</p>
      `;
      placeholder.style.color = '#ef4444';
    });
  }
  
  populateContent() {
    if (!this.data) return;
    
    this.populateTeamMembers();
    this.populateProjects();
    this.populateFeatures();
  }
  
  populateTeamMembers() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid || !this.data.teamMembers) return;
    
    // Clear existing content (including loading placeholder)
    teamGrid.innerHTML = '';
    
    this.data.teamMembers.forEach(member => {
      const memberElement = document.createElement('div');
      memberElement.className = 'team-member';
      memberElement.innerHTML = `
        <div class="member-photo">
          ${member.initials}
        </div>
        <h3>${member.name}</h3>
        <p class="member-role">${member.role}</p>
        <p class="member-program">${member.program}</p>
      `;
      teamGrid.appendChild(memberElement);
    });
    
    // Load profile pictures after team members are populated
    loadTeamProfilePictures();
  }
  
  populateProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid || !this.data.projects) return;
    
    // Clear existing content (including loading placeholder)
    projectsGrid.innerHTML = '';
    
    this.data.projects.forEach(project => {
      const projectElement = document.createElement('div');
      projectElement.className = 'project-card';
      projectElement.innerHTML = `
        <div class="project-icon">
          <i class="${project.icon}"></i>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-status">
          <span class="status-badge ${project.statusClass}">${project.status}</span>
        </div>
      `;
      projectsGrid.appendChild(projectElement);
    });
  }
  
  populateFeatures() {
    const featuresContainer = document.getElementById('featuresGrid');
    if (!featuresContainer || !this.data.features) return;
    
    // Clear existing content (including loading placeholder)
    featuresContainer.innerHTML = '';
    
    this.data.features.forEach(feature => {
      const featureElement = document.createElement('div');
      featureElement.className = 'feature';
      featureElement.innerHTML = `
        <i class="${feature.icon}"></i>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
      `;
      featuresContainer.appendChild(featureElement);
    });
  }
}

// Initialize website data manager
let websiteDataManager;

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);

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
