/**
 * LOOKPULSE PWA Installer & Mobile Utilities
 * Handles 'Add to Home Screen' (beforeinstallprompt) and Service Worker Registration
 */

const LPPwa = {
  deferredPrompt: null,

  init() {
    this.registerServiceWorker();
    this.setupInstallPrompt();
  },

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swPath = window.location.pathname.includes('/pages/') ? '../sw.js' : '/sw.js';
        navigator.serviceWorker.register(swPath).then((reg) => {
          console.log('PWA ServiceWorker registered:', reg.scope);
        }).catch((err) => {
          console.log('PWA ServiceWorker registration failed:', err);
        });
      });
    }
  },

  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });

    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      console.log('LOOKPULSE running in standalone app mode');
    }
  },

  showInstallBanner() {
    // Only show once per session
    if (sessionStorage.getItem('lp_pwa_banner_dismissed')) return;

    let banner = document.getElementById('lp-pwa-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'lp-pwa-banner';
      banner.className = 'pwa-banner';
      banner.innerHTML = `
        <div class="pwa-banner__content">
          <div class="pwa-banner__icon">✦</div>
          <div class="pwa-banner__text">
            <strong>LOOKPULSE 앱으로 더 편리하게!</strong>
            <span>홈 화면에 추가하여 앱처럼 빠르게 사용하세요.</span>
          </div>
        </div>
        <div class="pwa-banner__actions">
          <button type="button" class="btn btn--primary btn--sm" id="pwaInstallBtn">앱 설치</button>
          <button type="button" class="pwa-banner__close" id="pwaDismissBtn">✕</button>
        </div>
      `;
      document.body.appendChild(banner);

      document.getElementById('pwaInstallBtn').addEventListener('click', () => {
        if (this.deferredPrompt) {
          this.deferredPrompt.prompt();
          this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              LOOKPULSE.showToast('LOOKPULSE 앱이 설치되었습니다!', 'success');
            }
            this.deferredPrompt = null;
            banner.remove();
          });
        }
      });

      document.getElementById('pwaDismissBtn').addEventListener('click', () => {
        sessionStorage.setItem('lp_pwa_banner_dismissed', 'true');
        banner.remove();
      });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LPPwa.init();
});

window.LPPwa = LPPwa;
