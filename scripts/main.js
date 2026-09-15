/**
 * LOOKPULSE Core Application Utilities
 * Theme management, Toast, Modal, LocalStorage & Data Store
 */

const LOOKPULSE = {
  // State Storage Keys
  STORAGE_KEYS: {
    RECENT_SEARCHES: 'lookpulse_recent_searches',
    SAVED_OUTFITS: 'lookpulse_saved_outfits',
    LIKED_OUTFITS: 'lookpulse_liked_outfits',
    FOLLOWING_CREATORS: 'lookpulse_following_creators',
    THEME_PRIMARY: 'lookpulse_theme_primary'
  },

  // Initialize common UI behaviors
  init() {
    this.restoreTheme();
    this.setupToastContainer();
    this.setupGlobalNavigation();
  },

  // Toast System
  setupToastContainer() {
    if (!document.getElementById('lp-toast-container')) {
      const container = document.createElement('div');
      container.id = 'lp-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 32px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('lp-toast-container') || document.body;
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.style.cssText = `
      background: rgba(26, 26, 26, 0.95);
      color: #FFFFFF;
      padding: 12px 20px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transform: translateY(12px);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;
    
    let icon = '✨';
    if (type === 'success') icon = '✓';
    if (type === 'error') icon = '✕';
    if (type === 'saved') icon = '🔖';
    if (type === 'like') icon = '❤️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    // Auto dismiss
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  },

  // Pantone Yearly Theme Manager
  setPantoneTheme(primaryHex, lightHex, darkHex) {
    document.documentElement.style.setProperty('--color-primary', primaryHex);
    if (lightHex) document.documentElement.style.setProperty('--color-primary-light', lightHex);
    if (darkHex) document.documentElement.style.setProperty('--color-primary-dark', darkHex);
    localStorage.setItem(this.STORAGE_KEYS.THEME_PRIMARY, primaryHex);
    this.showToast(`테마 컬러가 ${primaryHex}로 변경되었습니다.`, 'success');
  },

  restoreTheme() {
    const saved = localStorage.getItem(this.STORAGE_KEYS.THEME_PRIMARY);
    if (saved) {
      document.documentElement.style.setProperty('--color-primary', saved);
    }
  },

  // Data Fetching Helper
  async fetchData(endpoint) {
    try {
      // Look for relative data directory based on page location
      const isPagesDir = window.location.pathname.includes('/pages/');
      const basePath = isPagesDir ? '../data/' : './data/';
      const response = await fetch(`${basePath}${endpoint}`);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      return await response.json();
    } catch (err) {
      console.warn(`Local fetch error (${endpoint}), falling back to embedded state`, err);
      return null;
    }
  },

  // Setup Global Nav active states
  setupGlobalNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/'))))) {
        link.classList.add('nav__link--active');
      }
    });
  }
};

// Auto init on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  LOOKPULSE.init();
});

window.LOOKPULSE = LOOKPULSE;
