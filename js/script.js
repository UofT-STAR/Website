if (window.location.hostname.includes("github.io")) {
  window.location.replace("https://www.utstar.ca");
}

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
  if (hamburger) hamburger.classList.remove('active');
  if (navMenu) navMenu.classList.remove('active');
}));

// Close mobile menu when clicking on dropdown links (Constitution page)
document.querySelectorAll('.dropdown-link').forEach(n => n.addEventListener('click', () => {
  if (hamburger) hamburger.classList.remove('active');
  if (navMenu) navMenu.classList.remove('active');
}));

// Enhanced Navbar - Active Page / Section Highlighting
function updateActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPage = document.body.dataset.page;

  // Multi-page site: use explicit page IDs from the HTML instead of
  // window.location.pathname. This survives custom domains, GitHub Pages
  // subpaths, redirects, extensionless URLs, and trailing slashes.
  if (currentPage) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === currentPage);
    });
    return;
  }

  // Fallback for legacy/in-page pages that do not have data-page on <body>.
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  const scrollPos = window.scrollY + 100;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  if (!current && sections.length) {
    let closest = null;
    let closestDistance = Infinity;
    sections.forEach(section => {
      const distance = Math.abs(scrollPos - section.offsetTop);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = section.getAttribute('id');
      }
    });
    current = closest;
  }

  const targetLink = current === 'presidents-message' ? 'about' : current;
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${targetLink}`);
  });
}
// Enhanced Navbar - Scroll Effects
let lastScrollY = window.scrollY;
const navbar = document.querySelector('.navbar');
const heroSection = document.querySelector('.hero');
const bannerSection = document.querySelector('.banner');
const introScene = document.querySelector('.intro-scene');
const pageReveal = document.querySelector('.page-reveal');

// Home intro sequence. Each value is a normalized point (0 -> 1) inside
// the pinned scroll scene. Changing these values changes the timing without
// requiring any CSS offsets or extra spacer elements.
const INTRO_SCROLL_CONFIG = {
  primaryRevealStart: 0.06,
  primaryRevealEnd: 0.18,
  primaryHoldEnd: 0.38,
  primaryFadeEnd: 0.46,
  mediaTransitionEnd: 0.60,
  secondaryRevealStart: 0.66,
  secondaryRevealEnd: 0.78,
  interactiveThreshold: 0.85,
  pageInteractiveThreshold: 0.01
};

const homeHeroVideo = document.getElementById('homeHeroVideo');
const primaryHeroContent = document.querySelector('.hero-content-primary');
const secondaryHeroContent = document.querySelector('.hero-content-secondary');
let homeVideoStarted = false;

function clamp01(value) {
  return Math.max(0, Math.min(value, 1));
}

function rangeProgress(value, start, end) {
  if (end <= start) return value >= end ? 1 : 0;
  return clamp01((value - start) / (end - start));
}

function getIntroStageProgress(sceneProgress, config = INTRO_SCROLL_CONFIG) {
  const primaryEnter = rangeProgress(
    sceneProgress,
    config.primaryRevealStart,
    config.primaryRevealEnd
  );

  // The first copy stays perfectly still and fully visible during the hold.
  const primaryExit = rangeProgress(
    sceneProgress,
    config.primaryHoldEnd,
    config.primaryFadeEnd
  );

  // The image begins changing only after the first copy has faded away.
  const videoProgress = rangeProgress(
    sceneProgress,
    config.primaryFadeEnd,
    config.mediaTransitionEnd
  );

  // Give the bare video a short beat before revealing the second copy.
  const secondaryEnter = rangeProgress(
    sceneProgress,
    config.secondaryRevealStart,
    config.secondaryRevealEnd
  );

  return {
    primaryEnter,
    primaryExit,
    primaryOpacity: primaryEnter * (1 - primaryExit),
    videoProgress,
    secondaryEnter,
    secondaryOpacity: secondaryEnter
  };
}

function updateHomeVideoPlayback(videoProgress) {
  if (!homeHeroVideo) return;

  if (videoProgress > 0.02) {
    if (!homeVideoStarted) {
      homeVideoStarted = true;
      const playPromise = homeHeroVideo.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          // Muted inline video normally autoplays, but the visual transition
          // still works with the poster if a browser blocks playback.
        });
      }
    }
    return;
  }

  if (homeVideoStarted) {
    homeHeroVideo.pause();
    homeVideoStarted = false;
    try {
      homeHeroVideo.currentTime = 0;
    } catch (error) {
      // Some browsers do not allow seeking until video metadata is available.
    }
  }
}

function updateHeroReveal() {
  if (!heroSection || !introScene) return;

  const sceneRect = introScene.getBoundingClientRect();
  const maxSceneScroll = Math.max(1, introScene.offsetHeight - window.innerHeight);
  const sceneScroll = Math.max(0, Math.min(-sceneRect.top, maxSceneScroll));
  const sceneProgress = clamp01(sceneScroll / maxSceneScroll);

  const {
    primaryEnter,
    primaryExit,
    primaryOpacity,
    videoProgress,
    secondaryEnter,
    secondaryOpacity
  } = getIntroStageProgress(sceneProgress);

  const overlayProgress = Math.max(
    primaryOpacity,
    secondaryOpacity,
    videoProgress * 0.5
  );
  const overlayOpacity = 0.2 + (overlayProgress * 0.75);
  const primaryTranslateY = (40 * (1 - primaryEnter)) - (24 * primaryExit);
  const secondaryTranslateY = 40 * (1 - secondaryEnter);

  introScene.style.setProperty('--primary-enter-progress', primaryEnter.toFixed(3));
  introScene.style.setProperty('--primary-exit-progress', primaryExit.toFixed(3));
  introScene.style.setProperty('--primary-content-opacity', primaryOpacity.toFixed(3));
  introScene.style.setProperty('--video-progress', videoProgress.toFixed(3));
  introScene.style.setProperty('--secondary-enter-progress', secondaryEnter.toFixed(3));
  introScene.style.setProperty('--secondary-content-opacity', secondaryOpacity.toFixed(3));
  introScene.style.setProperty('--intro-overlay-opacity', overlayOpacity.toFixed(3));
  introScene.style.setProperty('--primary-translate-y', `${primaryTranslateY.toFixed(1)}px`);
  introScene.style.setProperty('--secondary-translate-y', `${secondaryTranslateY.toFixed(1)}px`);

  if (primaryHeroContent) {
    primaryHeroContent.classList.toggle(
      'is-interactive',
      primaryOpacity > INTRO_SCROLL_CONFIG.interactiveThreshold
    );
  }

  if (secondaryHeroContent) {
    secondaryHeroContent.classList.toggle(
      'is-interactive',
      secondaryOpacity > INTRO_SCROLL_CONFIG.interactiveThreshold
    );
  }

  updateHomeVideoPlayback(videoProgress);

  // Kept for compatibility with any page that still uses the older page-reveal wrapper.
  if (pageReveal) {
    const pageProgress = rangeProgress(sceneProgress, 0.88, 1);
    pageReveal.style.setProperty('--page-reveal-progress', pageProgress.toFixed(3));
    pageReveal.classList.toggle(
      'page-reveal-active',
      pageProgress > INTRO_SCROLL_CONFIG.pageInteractiveThreshold
    );
  }
}

function handleNavbarScroll() {
  const currentScrollY = window.scrollY;
  
  // Update active nav link
  updateActiveNavLink();
  
  // Dynamic navbar styling based on scroll using classes
  if (navbar) {
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  lastScrollY = currentScrollY;
}

// Add scroll event listener with performance optimization
let ticking = false;

function optimizedScrollHandler() {
  handleNavbarScroll();
  updateHeroReveal();
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(optimizedScrollHandler);
    ticking = true;
  }
}, { passive: true });

window.addEventListener('resize', updateHeroReveal);

if (introScene && heroSection) {
  document.body.classList.add('intro-enhanced');
  if (pageReveal) {
    pageReveal.style.setProperty('--page-reveal-progress', '0');
  }
  updateHeroReveal();
}

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
const navLogoElement = document.querySelector('.nav-logo');
const logoImgElement = document.querySelector('.logo-img');

if (navLogoElement && logoImgElement) {
  navLogoElement.addEventListener('click', () => {
    if (!logoAnimating) {
      logoAnimating = true;
      currentRotation += 360;
      logoImgElement.style.transform = `rotate(${currentRotation}deg)`;
      logoImgElement.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => {
        logoAnimating = false;
      }, 800);
    }
  });

  navLogoElement.addEventListener('mouseenter', () => {
    if (!logoAnimating) {
      logoImgElement.style.transform = `rotate(${currentRotation}deg) scale(1.05)`;
      logoImgElement.style.transition = 'transform 0.3s ease';
    }
  });

  navLogoElement.addEventListener('mouseleave', () => {
    if (!logoAnimating) {
      logoImgElement.style.transform = `rotate(${currentRotation}deg)`;
      logoImgElement.style.transition = 'transform 0.3s ease';
    }
  });
}
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if href is just '#' or empty
    if (!href || href === '#') {
      return;
    }

    // Intro scene special case:
    // '#home' points to an absolutely-positioned hero inside a sticky scene,
    // so scrollIntoView can produce incremental drift on repeated clicks.
    // Force absolute top so every click lands at the same state.
    if (href === '#home' && introScene) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const target = document.querySelector(href);
    if (target) {
      // Use explicit offset scrolling to avoid sticky/positioned layout proble:s.
      const navbarHeight = navbar ? navbar.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
      const scrollTop = Math.max(0, targetTop - navbarHeight);

      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  });
});

// Navbar scroll effect - Cool dark theme (optimized)
let navbarTicking = false;

function updateNavbarStyle() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    navbarTicking = false;
    return;
  }
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
  // Set the active navbar item immediately on page load.
  updateActiveNavLink();

  // Initialize back to top button for any page
  initBackToTopButton();
  initLeadershipModal();
  
  // Initialize footer map (Leaflet + OpenStreetMap)
  initFooterMap();
  
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
    const extensions = ['webp', 'png', 'jpeg', 'jpg'];
    let imageLoaded = false;

    function tryLoadImage(index) {
      if (index >= extensions.length || imageLoaded) {
        return; // All extensions tried or image already loaded
      }

      const ext = extensions[index];
      const imagePath = `Images/TeamExecs/${filename}.${ext}`;

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

      img.src = imagePath; // Put the image path
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
    
    // Use arrow functions to preserve 'this' context
    
    // Start button initializes the game
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }

    // Restart button resets the game to the initial state
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartGame());
    }

    // Next button brings to the next question
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
    // Load shared site data on whichever split page needs it.
    if (document.getElementById('leadershipGrid') ||
        document.getElementById('teamGrid') ||
        document.getElementById('projectsGrid') ||
        document.getElementById('programsGrid') ||
        document.getElementById('outreachEventsGrid') ||
        document.getElementById('featuresGrid') ||
        document.getElementById('subteamsGrid') ||
        document.getElementById('joinOptionsGrid') ||
        document.getElementById('mentorsGrid') ||
        document.getElementById('sponsorsGrid') ||
        document.getElementById('homeProjectSpotlightContent')) {
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
    
    this.populateLeadershipMembers();
    this.populateProjects();
    this.populatePrograms();
    this.populateOutreachEvents();
    this.populateFeatures();
    this.populateSubteams();
    this.populateJoinOptions();
    this.populateMentors();
    this.populateSponsors();
    this.populateHomeProjectSpotlight();
  }

  populateHomeProjectSpotlight() {
    const container = document.getElementById('homeProjectSpotlightContent');
    const project = this.data.homeProjectSpotlight;
    if (!container || !project) return;

    const specs = Array.isArray(project.specs) ? project.specs : [];
    const featuredSpec = specs.find(spec => spec.featured) || specs[0];
    const secondarySpecs = specs.filter(spec => spec !== featuredSpec);

    const featuredSpecMarkup = featuredSpec ? `
      <div class="home-project-readout-primary">
        <span class="home-project-spec-eyebrow">${featuredSpec.eyebrow}</span>
        <strong>${featuredSpec.value}</strong>
        <span class="home-project-spec-label">${featuredSpec.label}</span>
      </div>
    ` : '';

    const secondarySpecsMarkup = secondarySpecs.map((spec, index) => `
      <div class="home-project-readout-secondary${index === 0 ? ' is-first' : ''}">
        <span class="home-project-spec-eyebrow">${spec.eyebrow}</span>
        <strong>${spec.value}</strong>
        <span class="home-project-spec-label">${spec.label}</span>
      </div>
    `).join('');

    const technicalNote = project.technicalNote || {};
    const missionNote = project.missionNote || {};

    const actionMarkup = project.href
      ? `<a class="home-project-cta" href="${project.href}">${project.actionLabel || 'View Project'} <span aria-hidden="true">→</span></a>`
      : '';

    container.innerHTML = `
      <div class="home-project-kicker">
        <span class="home-project-kicker-dot"></span>
        ${project.status || 'Featured Project'}
      </div>

      <h2 class="home-project-title">${project.title}</h2>

      <div class="home-project-brief">
        <div class="home-project-brief-lead">
          <p class="home-project-lede">${project.lede || ''}</p>
          <p class="home-project-callout">${project.callout || ''}</p>
        </div>

        <div class="home-project-brief-notes">
          <p>
            ${technicalNote.prefix || ''}<strong>${technicalNote.emphasis || ''}</strong>${technicalNote.suffix || ''}
          </p>
          <p>
            ${missionNote.prefix || ''}<strong>${missionNote.emphasis || ''}</strong>${missionNote.suffix || ''}
          </p>
        </div>
      </div>

      <div class="home-project-readout">
        ${featuredSpecMarkup}
        <div class="home-project-readout-stack">
          ${secondarySpecsMarkup}
        </div>
      </div>

      <div class="home-project-action">${actionMarkup}</div>
    `;
  }

  populateLeadershipMembers() {
    const leadershipGrid = document.getElementById('leadershipGrid') || document.getElementById('teamGrid');
    if (!leadershipGrid || !this.data.teamMembers) return;

    // Clear existing content (including loading placeholder).
    leadershipGrid.innerHTML = '';

    this.data.teamMembers.forEach((member, index) => {
      const memberElement = document.createElement('article');
      memberElement.className = 'team-member leadership-card';
      memberElement.setAttribute('role', 'button');
      memberElement.setAttribute('tabindex', '0');
      memberElement.setAttribute('aria-label', `View profile for ${member.name}`);
      memberElement.innerHTML = `
        <div class="member-photo">
          ${member.initials}
        </div>
        <h3>${member.name}</h3>
        <p class="member-role">${member.role}</p>
        <p class="member-program">${member.program}</p>
        <span class="leadership-card-action">
          View Profile <i class="fas fa-arrow-right"></i>
        </span>
      `;

      const openProfile = () => openLeadershipModal(index);
      memberElement.addEventListener('click', openProfile);
      memberElement.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openProfile();
        }
      });

      leadershipGrid.appendChild(memberElement);
    });

    // Load profile pictures after leadership cards are populated.
    loadTeamProfilePictures();
  }
  
  populateProjects() {
    this.populateProjectStyleCollection(
      'projectsGrid',
      this.data.projects,
      'projects',
      'No projects have been added yet.'
    );
  }

  populatePrograms() {
    this.populateProjectStyleCollection(
      'programsGrid',
      this.data.programs,
      'programs',
      'No programs have been added yet.'
    );
  }

  populateOutreachEvents() {
    this.populateProjectStyleCollection(
      'outreachEventsGrid',
      this.data.outreachEvents,
      'outreachEvents',
      'No outreach events have been added yet.'
    );
  }

  // Shared renderer for Projects and any other content that uses project cards.
  populateProjectStyleCollection(gridId, items, collectionKey, emptyMessage) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    // Clear existing content (including loading placeholder).
    grid.innerHTML = '';

    if (!Array.isArray(items) || items.length === 0) {
      grid.innerHTML = `
        <div class="loading-placeholder">
          <i class="fas fa-calendar-plus"></i>
          <p>${emptyMessage}</p>
        </div>
      `;
      return;
    }

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `View details for ${item.title}`);

      const openCard = () => openProjectModal(index, collectionKey);
      card.addEventListener('click', openCard);
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openCard();
        }
      });

      card.innerHTML = `
        <div class="project-icon">
          <i class="${item.icon || 'fas fa-rocket'}"></i>
        </div>
        <h3>${item.title}</h3>
        <p>${item.description || ''}</p>
        <div class="project-status">
          <span class="status-badge ${item.statusClass || ''}">${item.status || ''}</span>
        </div>
      `;

      grid.appendChild(card);
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
  
  populateSubteams() {
    const subteamsGrid = document.getElementById('subteamsGrid');
    if (!subteamsGrid || !Array.isArray(this.data.subteams)) return;

    subteamsGrid.innerHTML = '';

    this.data.subteams.forEach((subteam, index) => {
      const panel = document.createElement('article');
      panel.className = 'subteam-panel';

      const iconMarkup = subteam.icon
        ? `<div class="subteam-panel-icon" aria-hidden="true"><i class="${subteam.icon}"></i></div>`
        : '';

      panel.innerHTML = `
        <div class="subteam-panel-header">
          <div class="subteam-panel-index">${String(index + 1).padStart(2, '0')}</div>
          ${iconMarkup}
        </div>
        <div class="subteam-panel-body">
          <span class="subteam-panel-label">Technical Subteam</span>
          <h4>${subteam.name}</h4>
          <p>${subteam.description || ''}</p>
        </div>
      `;
      subteamsGrid.appendChild(panel);
    });
  }

  populateJoinOptions() {
    const joinGrid = document.getElementById('joinOptionsGrid');
    if (!joinGrid || !this.data.joinOptions) return;

    joinGrid.innerHTML = '';

    this.data.joinOptions.forEach(option => {
      const card = document.createElement('article');
      card.className = 'join-option-card';

      const action = option.href
        ? `<a class="btn btn-primary" href="${option.href}" target="_blank" rel="noopener">${option.actionLabel}</a>`
        : `<span class="btn btn-secondary join-option-disabled" aria-disabled="true">${option.actionLabel}</span>`;

      card.innerHTML = `
        <div class="join-option-icon">
          <i class="${option.icon}"></i>
        </div>
        <h3>${option.audience}</h3>
        <p>${option.description}</p>
        <div class="join-option-action">${action}</div>
      `;
      joinGrid.appendChild(card);
    });
  }

  populateMentors() {
    const mentorsGrid = document.getElementById('mentorsGrid');
    if (!mentorsGrid || !this.data.mentors) return;

    if (this.data.mentors.length === 0) {
      mentorsGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-user-astronaut"></i>
          <p>Mentor profiles will appear here.</p>
        </div>
      `;
      return;
    }

    mentorsGrid.innerHTML = '';
    this.data.mentors.forEach(mentor => {
      const card = document.createElement('article');
      card.className = 'partner-card';
      const image = mentor.image
        ? `<img class="partner-image" src="${mentor.image}" alt="${mentor.name}">`
        : `<div class="partner-image partner-image-placeholder"><i class="fas fa-user"></i></div>`;
      const organization = mentor.organization ? `<p class="partner-meta">${mentor.organization}</p>` : '';
      const bio = mentor.bio ? `<p>${mentor.bio}</p>` : '';
      const website = mentor.website
        ? `<a class="partner-link" href="${mentor.website}" target="_blank" rel="noopener">Learn more <i class="fas fa-arrow-up-right-from-square"></i></a>`
        : '';

      card.innerHTML = `
        ${image}
        <h4>${mentor.name}</h4>
        <p class="partner-role">${mentor.role || 'Mentor'}</p>
        ${organization}
        ${bio}
        ${website}
      `;
      mentorsGrid.appendChild(card);
    });
  }

  populateSponsors() {
    const sponsorsGrid = document.getElementById('sponsorsGrid');
    if (!sponsorsGrid || !this.data.sponsors) return;

    if (this.data.sponsors.length === 0) {
      sponsorsGrid.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-handshake"></i>
          <p>Sponsor profiles will appear here.</p>
        </div>
      `;
      return;
    }

    sponsorsGrid.innerHTML = '';
    this.data.sponsors.forEach(sponsor => {
      const card = document.createElement('article');
      card.className = 'partner-card sponsor-card';
      const logo = sponsor.logo
        ? `<img class="sponsor-logo" src="${sponsor.logo}" alt="${sponsor.name} logo">`
        : `<div class="sponsor-logo sponsor-logo-placeholder"><i class="fas fa-building"></i></div>`;
      const level = sponsor.level ? `<p class="partner-role">${sponsor.level}</p>` : '';
      const description = sponsor.description ? `<p>${sponsor.description}</p>` : '';
      const website = sponsor.website
        ? `<a class="partner-link" href="${sponsor.website}" target="_blank" rel="noopener">Visit website <i class="fas fa-arrow-up-right-from-square"></i></a>`
        : '';

      card.innerHTML = `
        ${logo}
        <h4>${sponsor.name}</h4>
        ${level}
        ${description}
        ${website}
      `;
      sponsorsGrid.appendChild(card);
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

// Project Modal Functionality
let currentCarouselIndex = 0;
let currentProjectImages = [];

function getLeadershipMember(memberIndex) {
  const members = window.websiteData?.teamMembers;
  if (!Array.isArray(members)) return null;
  return members[memberIndex] || null;
}

function setLeadershipModalPhoto(photoElement, member) {
  if (!photoElement || !member) return;

  photoElement.style.backgroundImage = '';
  photoElement.style.backgroundSize = '';
  photoElement.style.backgroundPosition = '';
  photoElement.style.backgroundRepeat = '';
  photoElement.textContent = member.initials || '';

  const filename = member.name.replace(/\s+/g, '');
  const extensions = ['webp', 'png', 'jpeg', 'jpg'];

  function tryExtension(index) {
    if (index >= extensions.length) return;

    const imagePath = `Images/TeamExecs/${filename}.${extensions[index]}`;
    const image = new Image();

    image.onload = () => {
      photoElement.style.backgroundImage = `url('${imagePath}')`;
      photoElement.style.backgroundSize = 'cover';
      photoElement.style.backgroundPosition = 'center';
      photoElement.style.backgroundRepeat = 'no-repeat';
      photoElement.textContent = '';
    };

    image.onerror = () => tryExtension(index + 1);
    image.src = imagePath;
  }

  tryExtension(0);
}

function openLeadershipModal(memberIndex) {
  const modal = document.getElementById('leadershipModal');
  const member = getLeadershipMember(memberIndex);
  if (!modal || !member) return;

  const nameElement = document.getElementById('leadershipModalName');
  const roleElement = document.getElementById('leadershipModalRole');
  const programElement = document.getElementById('leadershipModalProgram');
  const bioElement = document.getElementById('leadershipModalBio');
  const motivationElement = document.getElementById('leadershipModalMotivation');
  const contactElement = document.getElementById('leadershipModalContact');
  const photoElement = document.getElementById('leadershipModalPhoto');

  if (nameElement) nameElement.textContent = member.name;
  if (roleElement) roleElement.textContent = member.role;
  if (programElement) programElement.textContent = member.program;
  if (bioElement) bioElement.textContent = member.bio || 'A short bio will be added soon.';
  if (motivationElement) motivationElement.textContent = member.motivation || 'Their UofT STAR motivation will be added soon.';

  if (contactElement) {
    const contact = member.contact || {};
    const links = [];

    if (contact.email) {
      links.push(`<a class="leadership-contact-link" href="mailto:${contact.email}"><i class="fas fa-envelope"></i> Email</a>`);
    }

    if (contact.linkedin) {
      links.push(`<a class="leadership-contact-link" href="${contact.linkedin}" target="_blank" rel="noopener"><i class="fab fa-linkedin"></i> LinkedIn</a>`);
    }

    contactElement.innerHTML = links.length
      ? links.join('')
      : '<span class="leadership-contact-empty">Public contact information will be added soon.</span>';
  }

  setLeadershipModalPhoto(photoElement, member);

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const closeButton = modal.querySelector('.leadership-modal-close');
  if (closeButton) closeButton.focus();
}

function closeLeadershipModal() {
  const modal = document.getElementById('leadershipModal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function initLeadershipModal() {
  const modal = document.getElementById('leadershipModal');
  if (!modal) return;

  modal.querySelectorAll('[data-close-leadership-modal]').forEach(element => {
    element.addEventListener('click', closeLeadershipModal);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeLeadershipModal();
    }
  });
}

function ensureProjectModal() {
  let modal = document.getElementById('projectModal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.className = 'project-modal';
  modal.id = 'projectModal';
  modal.innerHTML = `
    <div class="project-modal-content">
      <button class="project-modal-close" type="button" onclick="closeProjectModal()" aria-label="Close details">×</button>
      <div class="project-modal-body">
        <div class="project-modal-icon">
          <i id="modalIcon"></i>
        </div>
        <h2 id="modalTitle"></h2>
        <div class="project-modal-status">
          <span class="status-badge" id="modalStatus"></span>
        </div>
        <p id="modalDescription"></p>
        <div class="project-carousel" id="modalCarousel"></div>
        <div class="project-details" id="modalDetails"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function openProjectModal(itemIndex, collectionKey = 'projects') {
  const data = window.websiteData || (websiteDataManager && websiteDataManager.data);
  const collection = data && Array.isArray(data[collectionKey]) ? data[collectionKey] : [];
  const item = collection[itemIndex];
  if (!item) return;

  const modal = ensureProjectModal();

  // Add modal content. Projects and outreach events use the same template.
  document.getElementById('modalIcon').className = item.icon || 'fas fa-rocket';
  document.getElementById('modalTitle').textContent = item.title;
  document.getElementById('modalDescription').textContent = item.detailedDescription || item.description || '';
  
  const statusBadge = document.getElementById('modalStatus');
  statusBadge.textContent = item.status || '';
  statusBadge.className = `status-badge ${item.statusClass || ''}`;
  statusBadge.style.display = item.status ? '' : 'none';
  
  // Add details
  const detailsContainer = document.getElementById('modalDetails');
  if (item.details && item.details.length > 0) {
    const defaultHeading = collectionKey === 'outreachEvents'
      ? 'Event Highlights & Details'
      : collectionKey === 'programs'
        ? 'Program Details & Objectives'
        : 'Key Features & Objectives';
    detailsContainer.innerHTML = `
      <h3>${item.detailsHeading || defaultHeading}</h3>
      <ul>
        ${item.details.map(detail => `<li>${detail}</li>`).join('')}
      </ul>
    `;
    detailsContainer.style.display = 'block';
  } else {
    detailsContainer.style.display = 'none';
  }
  
  // Setup carousel
  const carouselContainer = document.getElementById('modalCarousel');
  if (item.carouselImages && item.carouselImages.length > 0) {
    currentProjectImages = item.carouselImages;
    currentCarouselIndex = 0;
    
    carouselContainer.innerHTML = `
      <div class="carousel-container">
        <div class="carousel-track" id="carouselTrack">
          ${item.carouselImages.map((img, index) => `
            <div class="carousel-slide">
              <img src="${img}" alt="${item.title} - Image ${index + 1}" />
            </div>
          `).join('')}
        </div>
        ${item.carouselImages.length > 1 ? `
          <button class="carousel-button prev" onclick="changeSlide(-1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-button next" onclick="changeSlide(1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        ` : ''}
      </div>
      ${item.carouselImages.length > 1 ? `
        <div class="carousel-indicators">
          ${item.carouselImages.map((_, index) => `
            <div class="carousel-indicator ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></div>
          `).join('')}
        </div>
      ` : ''}
    `;
    carouselContainer.style.display = 'block';
  } else {
    currentProjectImages = [];
    carouselContainer.innerHTML = '';
    carouselContainer.style.display = 'none';
  }
  
  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  currentCarouselIndex = 0;
  currentProjectImages = [];
}

function changeSlide(direction) {
  currentCarouselIndex += direction;
  
  if (currentCarouselIndex < 0) {
    currentCarouselIndex = currentProjectImages.length - 1;
  } else if (currentCarouselIndex >= currentProjectImages.length) {
    currentCarouselIndex = 0;
  }
  
  updateCarousel();
}

function goToSlide(index) {
  currentCarouselIndex = index;
  updateCarousel();
}

function updateCarousel() {
  const track = document.getElementById('carouselTrack');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  if (track) {
    track.style.transform = `translateX(-${currentCarouselIndex * 100}%)`;
  }
  
  indicators.forEach((indicator, index) => {
    if (index === currentCarouselIndex) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('projectModal');
  if (event.target === modal) {
    closeProjectModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeProjectModal();
  }
});

// Add keyboard navigation for carousel
document.addEventListener('keydown', function(event) {
  const modal = document.getElementById('projectModal');
  if (modal && modal.classList.contains('active') && currentProjectImages.length > 1) {
    if (event.key === 'ArrowLeft') {
      changeSlide(-1);
    } else if (event.key === 'ArrowRight') {
      changeSlide(1);
    }
  }
});

// Footer map: Leaflet + OpenStreetMap, no API key required.
// Leaflet is loaded here on demand so individual HTML pages do not need to
// duplicate Leaflet <link>/<script> tags just because they share the footer.
function loadExternalScript(src, id) {
  return new Promise((resolve, reject) => {
    const existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', resolve, { once: true });
      existing.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      resolve();
    }, { once: true });
    script.addEventListener('error', reject, { once: true });
    document.head.appendChild(script);
  });
}

async function ensureFooterMapDependencies() {
  if (!document.getElementById('leaflet-css')) {
    const leafletCss = document.createElement('link');
    leafletCss.id = 'leaflet-css';
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);
  }

  if (typeof window.L === 'undefined') {
    await loadExternalScript(
      'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
      'leaflet-js'
    );
  }

  // Rotation is cosmetic. If the plugin is unavailable, the normal Leaflet
  // map still works, so do not let a plugin failure break the footer.
  if (!document.getElementById('leaflet-rotate-js')) {
    try {
      await loadExternalScript(
        'https://cdn.jsdelivr.net/npm/leaflet-rotate@0.2.7/dist/leaflet-rotate.js',
        'leaflet-rotate-js'
      );
    } catch (error) {
      console.warn('Leaflet rotate plugin could not be loaded:', error);
    }
  }
}

// Renders a live, draggable/zoomable map centered on the Bahen Centre.
async function initFooterMap() {
  const mapEl = document.getElementById('footer-map');
  if (!mapEl || mapEl.dataset.mapInitialized === 'true') return;

  try {
    await ensureFooterMapDependencies();
  } catch (error) {
    console.warn('Footer map dependencies could not be loaded:', error);
    return;
  }

  if (typeof window.L === 'undefined') return;
  mapEl.dataset.mapInitialized = 'true';

  const bahenCentre = [43.6596580, -79.3974008]; // bahen ip address (kidding it's just coords)

  const map = L.map(mapEl, {
    center: bahenCentre,
    zoom: 16,
    zoomControl: false,        // remove default +/- buttons (re-added smaller below)
    attributionControl: true,  // required attribution, kept intentionally
    dragging: true,
    scrollWheelZoom: false,    // prevents the map from hijacking page scroll
    doubleClickZoom: true,
    touchZoom: true,
    rotate: true,              // the rotation plugin
    rotateControl: false,      // hide built-in drag to rotate button
    bearing: 16               // align street grid to container edges (approximate)
  });

  // Re-enable scroll-zoom only once the user has clicked into the map
  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // Building outline, traced from OpenStreetMap data (way/141691917),
  // styled to match OSM's own orange building highlight.
  const bahenOutline = [ // thank u overpass-turbo.eu
    [43.6594434, -79.3973235], [43.6594286, -79.3973966], [43.6595276, -79.3974328],
    [43.6595585, -79.3972889], [43.6596427, -79.3968972], [43.6596665, -79.396907],
    [43.6596943, -79.3969185], [43.6597084, -79.3968541], [43.6600352, -79.3969841],
    [43.6600263, -79.3970247], [43.6600097, -79.3971007], [43.6600194, -79.3971044],
    [43.6599854, -79.3972674], [43.6599818, -79.3972847], [43.6600388, -79.3973077],
    [43.6600414, -79.397295], [43.6601144, -79.3973206], [43.6601547, -79.3971202],
    [43.6601814, -79.3971329], [43.6602363, -79.3971591], [43.6602341, -79.3971741],
    [43.660251, -79.3971812], [43.6602491, -79.3971904], [43.6602574, -79.3971939],
    [43.6602252, -79.3973536], [43.6602197, -79.3973515], [43.6602008, -79.3974474],
    [43.6599679, -79.3973534], [43.6599604, -79.3973894], [43.659828, -79.3973408],
    [43.6596755, -79.3980536], [43.6596497, -79.3980433], [43.6594705, -79.397972],
    [43.6594757, -79.3979447], [43.6594631, -79.3979401], [43.6594569, -79.397967],
    [43.6594359, -79.3979587], [43.6594186, -79.3979518], [43.6594014, -79.3979449],
    [43.6592391, -79.3978789], [43.6591596, -79.3978489], [43.6592283, -79.397538],
    [43.659223, -79.3975353], [43.6592058, -79.3975225], [43.6591853, -79.3974956],
    [43.6591717, -79.3974611], [43.6591666, -79.3974225], [43.6591703, -79.3973836],
    [43.6591826, -79.3973483], [43.6592022, -79.3973199], [43.6591928, -79.3973166],
    [43.6591954, -79.3973039], [43.6592499, -79.3973269], [43.6592519, -79.3973143],
    [43.6592391, -79.3973089], [43.6592528, -79.3972486], [43.6594434, -79.3973235]
  ];

  const bahenAddress = 'Bahen Centre for Information Technology<br>40 St. George St, Toronto';

  L.polygon(bahenOutline, {
    color: '#e65c00',
    weight: 3,
    fillColor: '#ff7800',
    fillOpacity: 0.4,
    className: 'bahen-outline'
  })
  .addTo(map)
    .bindTooltip('Bahen Centre for Information Technology', { sticky: true })
    .bindPopup(bahenAddress);
}
