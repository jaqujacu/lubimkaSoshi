// === ТАЙМЕР ===
function getPluralForm(number, forms) {
    let n = Math.abs(number) % 100;
    let n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
}

function calculateTimeTogether() {
    const startDate = new Date('2024-04-27T03:08:48');
    const now = new Date();

    if (now <= startDate) {
        return { years: 0, months: 0, days: 0, hours: 0 };
    }

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();

    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    return { years, months, days, hours };
}

function updateRelationshipTimer() {
    const time = calculateTimeTogether();

    document.getElementById('years').textContent = time.years;
    document.getElementById('months').textContent = time.months;
    document.getElementById('days').textContent = time.days;
    document.getElementById('hours').textContent = time.hours;

    document.querySelector('#years + .time-label').textContent = getPluralForm(time.years, ['год', 'года', 'лет']);
    document.querySelector('#months + .time-label').textContent = getPluralForm(time.months, ['месяц', 'месяца', 'месяцев']);
    document.querySelector('#days + .time-label').textContent = getPluralForm(time.days, ['день', 'дня', 'дней']);
    document.querySelector('#hours + .time-label').textContent = getPluralForm(time.hours, ['час', 'часа', 'часов']);
}

// === СТИЛИЗОВАННОЕ ОПОВЕЩЕНИЕ ===
function showAlert(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('customConfirm');
        const questionEl = document.getElementById('confirmQuestion');
        const buttons = modal.querySelector('.modal-buttons');

        if (!modal || !questionEl || !buttons) {
            console.error('❌ Модальное окно не готово для alert');
            resolve();
            return;
        }

        const originalButtons = buttons.innerHTML;
        questionEl.textContent = message;
        // ← Вот здесь текст кнопки:
        buttons.innerHTML = '<button class="modal-btn modal-btn-ok">Хорошо, хозяин</button>';

        modal.style.display = 'flex';
        modal.classList.add('show');

        const okBtn = modal.querySelector('.modal-btn-ok');
        okBtn.onclick = () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                buttons.innerHTML = originalButtons; // восстановить
                resolve();
            }, 300);
        };

        modal.onclick = (e) => {
            if (e.target === modal) okBtn.click();
        };
    });
}

// === КРАСИВОЕ МОДАЛЬНОЕ ОКНО ===
function customConfirm(question) {
    return new Promise((resolve) => {
        const modal = document.getElementById('customConfirm');
        const questionEl = document.getElementById('confirmQuestion');
        const yesBtn = modal.querySelector('.modal-btn-yes');
        const noBtn = modal.querySelector('.modal-btn-no');

        if (!modal || !questionEl || !yesBtn || !noBtn) {
            console.error('❌ Модальное окно не найдено!');
            resolve(false);
            return;
        }

        questionEl.textContent = question;
        modal.style.display = 'flex';
        modal.classList.add('show');

        const close = (result) => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                resolve(result);
            }, 300);
        };

        yesBtn.onclick = () => close(true);
        noBtn.onclick = () => close(false);

        modal.onclick = (e) => {
            if (e.target === modal) close(false);
        };
    });
}

// === ПИКАНТНЫЙ РАЗДЕЛ ===
async function initSpicySection() {
    const btn = document.getElementById('spicyBtn');
    const section = document.getElementById('spicySection');
    if (!btn || !section) return;

    const showSection = () => {
        section.style.display = 'block';
        btn.textContent = 'Скрыть';
        btn.onclick = hideSection;
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const hideSection = () => {
        section.style.display = 'none';
        btn.textContent = 'Тут немного горячее...';
        btn.onclick = askQuestions;
    };

   const askQuestions = async () => {
    const q1 = await customConfirm('А ты не слишком маленькая для таких вещей?');
    if (q1) { // ← ЕСЛИ "ДА" — значит, она считает себя маленькой → нельзя
        await showAlert('Тогда нельзя!');
        return;
    }

    const q2 = await customConfirm('Есть кто-то рядом, кто может подсмотреть?');
    if (q2) { // ← ЕСЛИ "ДА" — есть кто-то рядом → нельзя
        await showAlert('Тогда лучше отойди в сторонку или подожди, когда останешься одна');
        return;
    }

        showSection();
    };

    btn.onclick = askQuestions;
}

// === ФОНОВАЯ МУЗЫКА И АУДИО ===
document.addEventListener('DOMContentLoaded', () => {
    // Таймер
    updateRelationshipTimer();
    setInterval(updateRelationshipTimer, 60000);

    // Пикантный раздел
    initSpicySection();

    // Фоновая музыка
    const bgMusic = document.getElementById('bgMusic');
    const soundToggle = document.getElementById('soundToggle');
    if (bgMusic && soundToggle) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log('Музыка отложена'));

        soundToggle.onclick = (e) => {
            e.stopPropagation();
            if (bgMusic.paused) {
                bgMusic.play();
                soundToggle.querySelector('.icon').textContent = '🔊';
            } else {
                bgMusic.pause();
                soundToggle.querySelector('.icon').textContent = '🔇';
            }
        };
    }

    // Аудиоплеер голоса
    // Аудиоплеер голоса
const voiceBtn = document.getElementById('audioPlayerBtn');
if (voiceBtn) {
    const voice = new Audio('salo.ogg');
    voice.preload = 'auto';
    voice.volume = 1.0;

    // Обновляем состояние кнопки при любых изменениях
    const updateVoiceButton = () => {
        if (voice.paused || voice.ended) {
            voiceBtn.innerHTML = '<span>▶</span> Воспроизвести';
        } else {
            voiceBtn.innerHTML = '<span>⏸</span> Пауза';
        }
    };

    voiceBtn.onclick = () => {
        if (voice.paused || voice.ended) {
            // Сбросим позицию, если трек закончился
            if (voice.ended) {
                voice.currentTime = 0;
            }
            voice.play().then(() => {
                if (bgMusic && !bgMusic.paused) {
                    bgMusic.volume = 0.06;
                }
                updateVoiceButton();
            }).catch(err => {
                console.error('Ошибка воспроизведения:', err);
                updateVoiceButton();
            });
        } else {
            voice.pause();
            if (bgMusic && !bgMusic.paused) {
                bgMusic.volume = 0.3;
            }
            updateVoiceButton();
        }
    };

    // Слушаем события, чтобы кнопка всегда была в правильном состоянии
    voice.addEventListener('play', updateVoiceButton);
    voice.addEventListener('pause', updateVoiceButton);
    voice.addEventListener('ended', () => {
        // Гарантируем, что ended сбросит состояние
        setTimeout(updateVoiceButton, 100); // небольшая задержка для надёжности
    });
    voice.addEventListener('error', () => {
        console.error('Ошибка загрузки аудио salo.ogg');
        updateVoiceButton();
    });
}
});