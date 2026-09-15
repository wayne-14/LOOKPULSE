/**
 * LOOKPULSE Search System
 * Realtime autocomplete with Debounce, Recent searches FIFO, and 3-tab search routing
 */

const LPSearch = {
  debounceTimer: null,
  popularKeywords: [
    "성수 카페 데일리룩",
    "가을 레더자켓",
    "와이드 슬랙스",
    "데이트 플리츠스커트",
    "오피스 셋업",
    "결혼식 하객룩",
    "살로몬 스니커즈",
    "페스티벌 룩"
  ],

  init() {
    this.bindSearchInputs();
  },

  getRecentSearches() {
    try {
      const stored = localStorage.getItem(LOOKPULSE.STORAGE_KEYS.RECENT_SEARCHES);
      return stored ? JSON.parse(stored) : ["성수 카페", "레더 자켓", "와이드팬츠"];
    } catch {
      return [];
    }
  },

  addRecentSearch(keyword) {
    if (!keyword || !keyword.trim()) return;
    const trimmed = keyword.trim();
    let searches = this.getRecentSearches().filter(k => k.toLowerCase() !== trimmed.toLowerCase());
    searches.unshift(trimmed);
    if (searches.length > 10) searches = searches.slice(0, 10);
    localStorage.setItem(LOOKPULSE.STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
  },

  removeRecentSearch(keyword) {
    let searches = this.getRecentSearches().filter(k => k !== keyword);
    localStorage.setItem(LOOKPULSE.STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(searches));
  },

  clearRecentSearches() {
    localStorage.removeItem(LOOKPULSE.STORAGE_KEYS.RECENT_SEARCHES);
  },

  bindSearchInputs() {
    const input = document.querySelector('.search-bar__input');
    const popover = document.querySelector('.search-popover');
    if (!input || !popover) return;

    // Show suggestions on Focus
    input.addEventListener('focus', () => {
      this.renderSuggestions(input.value.trim());
      popover.classList.add('search-popover--visible');
    });

    // Close popover when clicked outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        popover.classList.remove('search-popover--visible');
      }
    });

    // Realtime input with Debounce (250ms)
    input.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.renderSuggestions(e.target.value.trim());
      }, 250);
    });

    // Enter key submit
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.executeSearch(input.value.trim());
      }
    });
  },

  renderSuggestions(query) {
    const popover = document.querySelector('.search-popover');
    if (!popover) return;

    if (!query) {
      // Render Recent + Popular Keywords
      const recent = this.getRecentSearches();
      popover.innerHTML = `
        <div class="search-popover__section">
          <div class="search-popover__header">
            <span class="search-popover__title">최근 검색어</span>
            ${recent.length > 0 ? `<button type="button" class="search-popover__clear-btn" onclick="LPSearch.handleClearAllRecent()">전체 삭제</button>` : ''}
          </div>
          <div class="search-popover__chips">
            ${recent.length > 0 
              ? recent.map(k => `
                <span class="chip chip--recent">
                  <a href="search.html?q=${encodeURIComponent(k)}" class="chip__link" onclick="LPSearch.addRecentSearch('${k}')">${k}</a>
                  <button type="button" class="chip__remove" onclick="LPSearch.handleRemoveRecent('${k}', event)">×</button>
                </span>
              `).join('')
              : '<span class="search-popover__empty">최근 검색 기록이 없습니다.</span>'
            }
          </div>
        </div>
        <div class="search-popover__section">
          <div class="search-popover__header">
            <span class="search-popover__title">인기 급상승 키워드 🔥</span>
          </div>
          <ol class="search-popover__ranked-list">
            ${this.popularKeywords.map((k, idx) => `
              <li class="search-popover__rank-item">
                <span class="rank-num ${idx < 3 ? 'rank-num--top' : ''}">${idx + 1}</span>
                <a href="search.html?q=${encodeURIComponent(k)}" class="rank-keyword" onclick="LPSearch.addRecentSearch('${k}')">${k}</a>
              </li>
            `).join('')}
          </ol>
        </div>
      `;
    } else {
      // Filter matching keywords
      const matched = this.popularKeywords.filter(k => k.toLowerCase().includes(query.toLowerCase()));
      const relatedMatches = [
        `${query} 데일리룩`,
        `${query} 스타일링`,
        `${query} 추천 코디`,
        ...matched
      ];
      const uniqueRelated = Array.from(new Set(relatedMatches)).slice(0, 6);

      popover.innerHTML = `
        <div class="search-popover__section">
          <div class="search-popover__header">
            <span class="search-popover__title">'${query}' 연관 검색어</span>
          </div>
          <ul class="search-popover__autocomplete-list">
            ${uniqueRelated.map(item => `
              <li class="search-popover__autocomplete-item">
                <a href="search.html?q=${encodeURIComponent(item)}" onclick="LPSearch.addRecentSearch('${item}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <span>${this.highlightMatch(item, query)}</span>
                </a>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }
  },

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  },

  handleRemoveRecent(keyword, event) {
    event.stopPropagation();
    event.preventDefault();
    this.removeRecentSearch(keyword);
    const input = document.querySelector('.search-bar__input');
    this.renderSuggestions(input ? input.value.trim() : '');
  },

  handleClearAllRecent() {
    this.clearRecentSearches();
    const input = document.querySelector('.search-bar__input');
    this.renderSuggestions(input ? input.value.trim() : '');
  },

  executeSearch(keyword) {
    if (!keyword) return;
    this.addRecentSearch(keyword);
    const isPagesDir = window.location.pathname.includes('/pages/');
    const target = isPagesDir ? 'search.html' : 'pages/search.html';
    window.location.href = `${target}?q=${encodeURIComponent(keyword)}`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  LPSearch.init();
});

window.LPSearch = LPSearch;
