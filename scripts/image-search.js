/**
 * LOOKPULSE Image Hotspot & Visual Product Search Engine
 * Renders pulse pins on outfit images, triggers product popovers, and visual similarity matches
 */

const LPImageSearch = {
  activePinId: null,

  // Render hotspot pins over an image container
  renderPins(containerEl, pins = [], options = {}) {
    if (!containerEl) return;
    
    // Ensure relative positioning
    containerEl.style.position = 'relative';

    // Remove existing pins
    const existing = containerEl.querySelectorAll('.hotspot-pin, .hotspot-popover');
    existing.forEach(el => el.remove());

    pins.forEach(pin => {
      const pinBtn = document.createElement('button');
      pinBtn.type = 'button';
      pinBtn.className = `hotspot-pin ${pin.isSponsoredItem ? 'hotspot-pin--sponsored' : ''}`;
      pinBtn.style.left = `${pin.x}%`;
      pinBtn.style.top = `${pin.y}%`;
      pinBtn.setAttribute('data-pin-id', pin.id);
      pinBtn.setAttribute('aria-label', `${pin.name} 상품 보기`);

      pinBtn.innerHTML = `
        <span class="hotspot-pin__pulse"></span>
        <span class="hotspot-pin__core"></span>
      `;

      pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePinPopover(containerEl, pin, pinBtn);
      });

      containerEl.appendChild(pinBtn);
    });

    // Dismiss popover on container click
    containerEl.addEventListener('click', () => {
      this.closeAllPopovers(containerEl);
    });
  },

  togglePinPopover(containerEl, pin, pinBtn) {
    const isAlreadyOpen = pinBtn.classList.contains('hotspot-pin--active');
    this.closeAllPopovers(containerEl);

    if (isAlreadyOpen) return;

    pinBtn.classList.add('hotspot-pin--active');

    const popover = document.createElement('div');
    popover.className = 'hotspot-popover';
    popover.style.left = `${pin.x}%`;
    popover.style.top = `${pin.y}%`;

    const isPagesDir = window.location.pathname.includes('/pages/');
    const searchUrl = isPagesDir ? 'image-search.html' : 'pages/image-search.html';

    popover.innerHTML = `
      <div class="hotspot-popover__content">
        ${pin.isSponsoredItem ? '<span class="badge badge--sponsored">협찬 상품</span>' : ''}
        <h4 class="hotspot-popover__title">${pin.name}</h4>
        <div class="hotspot-popover__meta">
          <span class="hotspot-popover__brand">${pin.brand}</span>
          <span class="hotspot-popover__price">${pin.price.toLocaleString()}원</span>
        </div>
        <div class="hotspot-popover__actions">
          <a href="${searchUrl}?productId=${pin.productId || 'prod-1'}&category=${pin.category}" class="btn btn--sm btn--primary">
            유사 상품 검색 🔍
          </a>
        </div>
      </div>
    `;

    // Adjust position if overflowing boundaries
    if (pin.x > 60) popover.classList.add('hotspot-popover--left');
    if (pin.y > 60) popover.classList.add('hotspot-popover--top');

    popover.addEventListener('click', (e) => e.stopPropagation());
    containerEl.appendChild(popover);
  },

  closeAllPopovers(containerEl) {
    containerEl.querySelectorAll('.hotspot-pin').forEach(btn => btn.classList.remove('hotspot-pin--active'));
    containerEl.querySelectorAll('.hotspot-popover').forEach(pop => pop.remove());
  }
};

window.LPImageSearch = LPImageSearch;
