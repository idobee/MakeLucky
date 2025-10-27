# GitHub Pages 배포 가이드

MakeLucky 서비스를 https://idobee.github.io/MakeLucky 에서 서비스하기 위한 설정 가이드입니다.

## 🚀 배포 단계

### 1단계: Pull Request 머지
현재 작업 중인 브랜치(`copilot/add-luck-service-to-idobee`)를 `main` 브랜치로 머지합니다.

### 2단계: GitHub Pages 설정

1. GitHub 저장소 페이지로 이동: https://github.com/idobee/MakeLucky
2. **Settings** 탭 클릭
3. 왼쪽 메뉴에서 **Pages** 클릭
4. **Source** 섹션에서 **"GitHub Actions"** 선택
5. 설정 저장

### 3단계: 배포 확인

1. **Actions** 탭에서 배포 워크플로우 진행 상황 확인
2. 배포 완료 후 https://idobee.github.io/MakeLucky 접속
3. MakeLucky 서비스 정상 작동 확인

## 📋 포함된 파일

- `index.html` - 메인 웹페이지
- `style.css` - 스타일시트 (그라데이션, 애니메이션)
- `script.js` - 행운 생성 로직
- `.github/workflows/deploy.yml` - GitHub Actions 배포 워크플로우
- `README.md` - 프로젝트 문서

## ✨ 서비스 특징

- **20개의 행운 메시지**: 다양한 긍정적인 메시지 제공
- **반응형 디자인**: 모바일/태블릿/데스크톱 모두 지원
- **아름다운 UI**: 그라데이션 배경과 부드러운 애니메이션
- **사용자 친화적**: 버튼 클릭 또는 Enter 키로 실행 가능
- **카운터 기능**: 생성된 행운 개수 추적

## 🔧 로컬 테스트

```bash
# Python 3 사용
python -m http.server 8000

# Node.js 사용
npx serve

# 브라우저에서 http://localhost:8000 접속
```

## 📝 참고사항

- `main` 브랜치에 푸시하면 자동으로 배포됩니다
- GitHub Actions를 통해 자동 배포되므로 별도의 빌드 과정이 필요 없습니다
- 정적 파일만 사용하므로 서버 비용이 발생하지 않습니다

## 🎉 완료!

모든 설정이 완료되면 https://idobee.github.io/MakeLucky 에서 서비스를 이용할 수 있습니다!
