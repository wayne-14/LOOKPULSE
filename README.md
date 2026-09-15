# LOOKPULSE - 패션 소셜 커뮤니티 웹 서비스

> **Discover Style, Find the Item, Share Your Look**
> 누구나 가볍게 참여하고 코디 속 착장 아이템을 즉각 탐색하며, 크리에이터로 활동할 수 있는 비주얼 패션 커뮤니티

---

## 🌟 프로젝트 특징

1. **Pantone Color of the Year 테마 아키텍처**:
   - `:root`의 `--color-primary` 등 CSS 변수를 단 한 줄 변경하는 것만으로 사이트 전체의 주요 버튼, 뱃지, 포인트 컬러가 일괄 전환됩니다.
2. **인터랙티브 핫스팟 핀 (Hotspot Pin)**:
   - 코디 사진 위 상대좌표(`x%`, `y%`) 기반의 펄스 핀을 클릭하면 착장 상품명, 브랜드, 가격 및 유사 상품 검색 링크를 팝오버로 제공합니다.
3. **AI 비주얼 유사 상품 검색 (Visual Match)**:
   - 착장 아이템과 유사한 실루엣/카테고리의 상품을 유사도(%)와 함께 매칭하여 보여줍니다.
4. **투명한 크리에이터 협찬 생태계**:
   - 협찬/광고 콘텐츠에 `[협찬 AD]` 전용 골드 뱃지를 명확히 부착하고, 크리에이터 프로필에서 협찬 룩을 필터링할 수 있습니다.
5. **순수 HTML5/BEM CSS/Vanilla JS**:
   - 외부 프레임워크(Tailwind, Bootstrap 등) 의존성 없이 단일 HTML 파일 내부 `<style>` 태그에 BEM 명명법으로 스타일을 캡슐화했습니다.

---

## 📁 디렉토리 구조

```text
wayne/
├── index.html                     # [P-01] 메인 홈 (히어로, 올해의 컬러 피커, 트렌드 피드, 라이징 크리에이터)
├── pages/
│   ├── explore.html               # [P-02] 상황별/계절별 TPO 큐레이션 탐색
│   ├── search.html                # [P-03] 코디 / 크리에이터 / 상품 3-Tab 통합 검색
│   ├── outfit-detail.html         # [P-04] 인터랙티브 핫스팟 핀 & 착장 아이템 & 댓글
│   ├── image-search.html          # [P-06] 이미지 기반 유사 상품 매칭 뷰어
│   ├── creator-profile.html       # [P-07] 크리에이터 프로필 & 협찬 룩북 필터링
│   ├── upload.html                # [P-05] 코디 업로드 및 인터랙티브 핀 마킹 캔버스
│   ├── saved.html                 # [P-09] 저장한 코디 북마크 컬렉션
│   ├── notifications.html         # [P-10] 활동 알림 & 브랜드 협찬 제안 센터
│   ├── user-profile.html          # [P-08] 마이페이지
│   └── auth.html                  # [P-11] 로그인 및 회원가입
├── scripts/
│   ├── main.js                    # 전역 토스트, 테마 변수 매니저, 데이터 fetch 유틸
│   ├── search.js                  # 실시간 연관검색어 (Debounce), 최근/인기 검색어
│   ├── community.js               # 좋아요, 북마크, 팔로우 토글, 댓글 인터랙션
│   └── image-search.js            # 이미지 핫스팟 핀 및 팝오버 렌더링 엔진
├── data/
│   ├── outfits.json               # 코디 데이터셋 (핀 좌표, TPO 태그, 협찬 정보)
│   ├── creators.json              # 크리에이터 프로필 데이터셋
│   └── products.json              # 상품 카탈로그 및 유사 상품 매칭 데이터셋
└── docs/
    └── PRD.md                     # 제품 요구사항 명세서 (PRD)
```

---

## 🚀 로컬 실행 방법

외부 패키지 설치 없이 Python 또는 Node의 내장 웹서버로 즉시 구동 가능합니다.

```bash
# Python 3 이용 시
python3 -m http.server 8000

# 브라우저 접속
# http://localhost:8000
```
