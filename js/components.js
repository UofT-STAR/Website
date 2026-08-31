// Shared site chrome for UofT STAR.
// Navbar/footer content lives here so every page stays consistent.

(() => {
  const SITE = {
    name: 'UofT STAR',
    logo: 'Images/UTSTAR_logo.webp',
    email: 'utstar@studentorg.utoronto.ca',
    instagram: 'https://www.instagram.com/uoftstar/',
    discord: 'https://discord.gg/nNsQn5J4SU',
    copyrightYear: 2026
  };

  const NAV_ITEMS = [
    { page: 'home', label: 'Home', href: 'index.html' },
    { page: 'projects', label: 'Projects', href: 'projects.html' },
    { page: 'aiaa', label: 'AIAA', href: 'aiaa.html' },
    { page: 'events', label: 'Events', href: 'events.html' },
    { page: 'sponsors', label: 'Sponsors', href: 'sponsors.html' },
    { page: 'team', label: 'Team', href: 'team.html' },
    { page: 'about', label: 'About Us', href: 'about.html' },
    { page: 'contact', label: 'Contact', href: 'contact.html' },
    { page: 'join-us', label: 'Join Us', href: 'join-us.html' },
    // Re-enable when wanted:
    // { page: 'constitution', label: 'Constitution', href: 'Constitution.html' },
    //{ page: 'trivia', label: 'Trivia', href: 'trivia.html' }
  ];

  function renderNavbar() {
    const nav = document.getElementById('site-navbar');
    if (!nav) return;

    const currentPage = document.body.dataset.page || '';
    nav.className = 'navbar';
    nav.innerHTML = `
      <div class="nav-container">
        <div class="nav-logo">
          <img src="${SITE.logo}" alt="UofT STAR Logo" class="logo-img">
          <span>${SITE.name}</span>
        </div>
        <ul class="nav-menu">
          ${NAV_ITEMS.map(item => `
            <li class="nav-item">
              <a href="${item.href}"
                 class="nav-link${item.page === currentPage ? ' active' : ''}"
                 data-page="${item.page}">${item.label}</a>
            </li>
          `).join('')}
        </ul>
        <div class="hamburger" aria-label="Toggle navigation" role="button" tabindex="0">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>
    `;
  }

  function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">
            <img src="${SITE.logo}" alt="UofT STAR Logo" class="footer-logo-img">
            <span>${SITE.name}</span>
          </div>

          <div class="footer-info">
            <div class="footer-map" id="footer-map"></div>
          </div>

          <div class="footer-social">
            <a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="mailto:${SITE.email}" aria-label="Email"><i class="fas fa-envelope"></i></a>
            <a href="${SITE.discord}" target="_blank" rel="noopener" aria-label="Discord"><i class="fab fa-discord"></i></a>
          </div>
        </div>
        <p>&copy; ${SITE.copyrightYear} University of Toronto Student Team for Amateur Rocketry. All rights reserved.</p>
      </div>
    `;

    if (!document.getElementById('backToTop')) {
      footer.insertAdjacentHTML('afterend', `
        <button id="backToTop" class="back-to-top" onclick="scrollToTop()" aria-label="Back to top">
          <i class="fas fa-chevron-up"></i>
        </button>
      `);
    }
  }

  window.UTSTAR_SITE = SITE;
  renderNavbar();
  renderFooter();
})();
