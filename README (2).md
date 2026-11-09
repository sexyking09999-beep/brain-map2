# 뇌 맵핑 동아리 사이트 설치·편집 가이드

## 처음 한 번만 (대표 1명)
1. github.com 가입 → 오른쪽 위 + → **New repository** → 이름 입력(예: brain-map), **Public** 선택 → Create.
2. **uploading an existing file** 링크를 눌러 이 폴더의 파일 전체를 드래그해서 올리고 **Commit changes**.
   (index.html, region.html, js 폴더, regions 폴더가 모두 올라가야 해요. 폴더째 드래그하면 돼요.)
3. 저장소 **Settings → Pages → Branch: main / (root) → Save**. 1~2분 뒤 주소가 나와요.
4. `js/config.js`를 열어 연필 아이콘으로 편집하고 `"내아이디/저장소이름"`을 실제 값으로 바꿔요. 예: `"myclub/brain-map"`
5. **Settings → Collaborators → Add people**로 동아리원을 초대해요.

## 설명 채우기 (각자)
- 사이트에서 담당 부위 페이지 → **✏️ 이 페이지 편집** → 내용 수정 → **Commit changes**.
- 1~2분 뒤 사이트에 반영돼요. 부위별로 파일이 나뉘어 있어서 서로 안 겹쳐요.
- 쓰는 법: `## 제목`, `- 목록`, `**굵게**`, `[이름](https://주소)`

## 부위 추가
1. `regions` 폴더에 `새id.md` 파일 추가
2. `js/regions.js`에 한 줄 추가 (id, 이름, 모양 d, 글자 위치 lx/ly 등)
