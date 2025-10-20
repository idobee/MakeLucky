// 행운 메시지 배열
const luckMessages = [
    "오늘은 특별한 행운이 찾아올 거예요! ✨",
    "좋은 일이 연속으로 일어날 것 같아요! 🌟",
    "당신의 노력이 곧 결실을 맺을 거예요! 🍀",
    "예상치 못한 기쁜 소식이 들려올 거예요! 🎉",
    "새로운 기회가 문을 두드릴 거예요! 🚪",
    "오늘 만나는 사람들과 좋은 인연이 될 거예요! 💫",
    "마음먹은 일이 술술 풀릴 거예요! 🌈",
    "행운의 여신이 당신을 미소짓고 있어요! 😊",
    "긍정적인 에너지가 가득한 하루가 될 거예요! ⚡",
    "작은 행복들이 쌓여 큰 기쁨이 될 거예요! 🎁",
    "오늘은 당신의 날입니다! 🌟",
    "좋은 결과를 기대해도 좋아요! 🎯",
    "당신의 꿈이 현실이 되는 날이 가까워요! 🌠",
    "행운이 당신과 함께 있어요! 🍀",
    "오늘 하루 모든 일이 순조로울 거예요! ✅",
    "특별한 선물 같은 하루가 될 거예요! 🎀",
    "당신의 미소가 더 큰 행운을 부를 거예요! 😄",
    "긍정의 힘이 기적을 만들 거예요! 💪",
    "오늘은 당신에게 완벽한 날이에요! 💯",
    "행복한 순간들이 가득할 거예요! 💝"
];

let count = 0;
const luckyButton = document.getElementById('luckyButton');
const luckDisplay = document.getElementById('luckDisplay');
const luckMessage = luckDisplay.querySelector('.luck-message');
const countElement = document.getElementById('count');

// 행운 생성 함수
function generateLuck() {
    // 버튼 비활성화 (연속 클릭 방지)
    luckyButton.disabled = true;
    
    // 애니메이션 효과
    luckDisplay.classList.add('animate', 'active');
    
    // 랜덤 메시지 선택
    const randomIndex = Math.floor(Math.random() * luckMessages.length);
    const newMessage = luckMessages[randomIndex];
    
    // 페이드 효과를 위한 타이밍
    setTimeout(() => {
        luckMessage.style.opacity = '0';
        
        setTimeout(() => {
            luckMessage.textContent = newMessage;
            luckMessage.style.opacity = '1';
            count++;
            countElement.textContent = count;
            
            // 애니메이션 클래스 제거
            setTimeout(() => {
                luckDisplay.classList.remove('animate');
            }, 500);
            
            // 버튼 다시 활성화
            luckyButton.disabled = false;
        }, 300);
    }, 200);
}

// 메시지 전환 스타일
luckMessage.style.transition = 'opacity 0.3s ease';

// 버튼 클릭 이벤트
luckyButton.addEventListener('click', generateLuck);

// 엔터 키로도 실행 가능
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !luckyButton.disabled) {
        generateLuck();
    }
});
