/**
 * LOOKPULSE Community & Social Interaction System
 * Like heart toggle, Bookmark save, Follow creator, and Comments
 */

const LPCommunity = {
  getLikes() {
    try {
      const stored = localStorage.getItem(LOOKPULSE.STORAGE_KEYS.LIKED_OUTFITS);
      return stored ? JSON.parse(stored) : ['outfit-1'];
    } catch {
      return ['outfit-1'];
    }
  },

  getSaves() {
    try {
      const stored = localStorage.getItem(LOOKPULSE.STORAGE_KEYS.SAVED_OUTFITS);
      return stored ? JSON.parse(stored) : ['outfit-1', 'outfit-2'];
    } catch {
      return ['outfit-1', 'outfit-2'];
    }
  },

  getFollowings() {
    try {
      const stored = localStorage.getItem(LOOKPULSE.STORAGE_KEYS.FOLLOWING_CREATORS);
      return stored ? JSON.parse(stored) : ['creator-1', 'creator-4'];
    } catch {
      return ['creator-1', 'creator-4'];
    }
  },

  toggleLike(outfitId, btnElement) {
    let likes = this.getLikes();
    const isLiked = likes.includes(outfitId);
    let countEl = null;

    if (btnElement) {
      countEl = btnElement.querySelector('.social-btn__count') || btnElement.nextElementSibling;
    }

    if (isLiked) {
      likes = likes.filter(id => id !== outfitId);
      if (btnElement) btnElement.classList.remove('social-btn--active', 'social-btn--liked');
      if (countEl) {
        const cur = parseInt(countEl.textContent, 10);
        if (!isNaN(cur) && cur > 0) countEl.textContent = cur - 1;
      }
      LOOKPULSE.showToast('좋아요를 취소했습니다.', 'info');
    } else {
      likes.push(outfitId);
      if (btnElement) {
        btnElement.classList.add('social-btn--active', 'social-btn--liked');
        // Pulse animation
        btnElement.style.transform = 'scale(1.25)';
        setTimeout(() => { btnElement.style.transform = 'scale(1)'; }, 200);
      }
      if (countEl) {
        const cur = parseInt(countEl.textContent, 10);
        if (!isNaN(cur)) countEl.textContent = cur + 1;
      }
      LOOKPULSE.showToast('코디에 좋아요를 눌렀습니다!', 'like');
    }

    localStorage.setItem(LOOKPULSE.STORAGE_KEYS.LIKED_OUTFITS, JSON.stringify(likes));
    return !isLiked;
  },

  toggleSave(outfitId, btnElement) {
    let saves = this.getSaves();
    const isSaved = saves.includes(outfitId);

    if (isSaved) {
      saves = saves.filter(id => id !== outfitId);
      if (btnElement) btnElement.classList.remove('social-btn--active', 'social-btn--saved');
      LOOKPULSE.showToast('저장 컬렉션에서 삭제되었습니다.', 'info');
    } else {
      saves.push(outfitId);
      if (btnElement) btnElement.classList.add('social-btn--active', 'social-btn--saved');
      LOOKPULSE.showToast('코디가 [내 저장함]에 담겼습니다!', 'saved');
    }

    localStorage.setItem(LOOKPULSE.STORAGE_KEYS.SAVED_OUTFITS, JSON.stringify(saves));
    return !isSaved;
  },

  toggleFollow(creatorId, btnElement) {
    let followings = this.getFollowings();
    const isFollowing = followings.includes(creatorId);

    if (isFollowing) {
      followings = followings.filter(id => id !== creatorId);
      if (btnElement) {
        btnElement.classList.remove('btn--following');
        btnElement.textContent = '+ 팔로우';
      }
      LOOKPULSE.showToast('크리에이터 팔로우를 취소했습니다.', 'info');
    } else {
      followings.push(creatorId);
      if (btnElement) {
        btnElement.classList.add('btn--following');
        btnElement.textContent = '✓ 팔로잉';
      }
      LOOKPULSE.showToast('크리에이터를 팔로우합니다!', 'success');
    }

    localStorage.setItem(LOOKPULSE.STORAGE_KEYS.FOLLOWING_CREATORS, JSON.stringify(followings));
    return !isFollowing;
  },

  // Add Comment helper
  addComment(containerEl, authorName, text) {
    if (!text || !text.trim()) return;
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.innerHTML = `
      <div class="comment-item__avatar">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar" />
      </div>
      <div class="comment-item__body">
        <div class="comment-item__meta">
          <span class="comment-item__author">${authorName || '나 (User)'}</span>
          <span class="comment-item__time">방금 전</span>
        </div>
        <p class="comment-item__text">${text}</p>
      </div>
    `;
    containerEl.prepend(commentItem);
    LOOKPULSE.showToast('댓글이 등록되었습니다.', 'success');
  }
};

window.LPCommunity = LPCommunity;
