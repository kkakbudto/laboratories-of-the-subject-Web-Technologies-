const fakeCursor = document.querySelector(".fake-cursor");
if (fakeCursor) {
    document.addEventListener("mousemove", e => {
        fakeCursor.style.left = e.clientX + "px";
        fakeCursor.style.top = e.clientY + "px";
    });
}

const sw = document.getElementById('theme-switch');
const savedTheme = localStorage.getItem('siteTheme');
if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
}
if (sw) {
    sw.addEventListener('click', () => {
        document.body.classList.toggle('theme-dark');
        const isDark = document.body.classList.contains('theme-dark');
        localStorage.setItem('siteTheme', isDark ? 'dark' : 'light');
    });
} else {
    console.error("Ошибка: кнопка переключения темы (#theme-switch) не найдена.");
}

const langs = ['lang-ru', 'lang-en', 'lang-es'];
let li = 0;
const langSw = document.getElementById('lang-switch');
if (langSw) {
    langSw.addEventListener('click', () => {
        langs.forEach(l => document.body.classList.remove(l));
        li = (li + 1) % langs.length;
        document.body.classList.add(langs[li]);
    });
}

let activeAudio = null;
const audioButtons = document.querySelectorAll('.audio-btn');
const daisyGif = document.getElementById('daisy-gif');
const mikyGif = document.getElementById('miky-gif');
const overlayGif = document.getElementById('overlay-gif');
audioButtons.forEach(button => {
    button.addEventListener('click', () => {
        const audioSrc = button.getAttribute('data-audio');
        if (audioSrc) {
            if (activeAudio) {
                activeAudio.pause();
                activeAudio.currentTime = 0;
                if (daisyGif) daisyGif.classList.remove('show');
                if (mikyGif) mikyGif.classList.remove('show');
                if (overlayGif) overlayGif.classList.remove('show');
            }
            const newAudio = new Audio(audioSrc);
            if (audioSrc.includes('phrase3.mp3')) {
                newAudio.volume = 0.2;
            }
            newAudio.play();
            activeAudio = newAudio;
            if (audioSrc.includes('phrase3.mp3')) {
                if (daisyGif) daisyGif.classList.add('show');
                if (mikyGif) mikyGif.classList.add('show');
                if (overlayGif) overlayGif.classList.add('show');
            }
            newAudio.addEventListener('ended', () => {
                if (activeAudio === newAudio) {
                    activeAudio = null;
                    if (daisyGif) daisyGif.classList.remove('show');
                    if (mikyGif) mikyGif.classList.remove('show');
                    if (overlayGif) overlayGif.classList.remove('show');
                }
            });
        }
    });
});

const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
}

const addWordBtn = document.getElementById('add-word-btn');
const toggleDictBtn = document.getElementById('toggle-dict-btn');
const clearDictBtn = document.getElementById('clear-dict-btn');
const dictContainer = document.getElementById('dictionary-container');
const dictTbody = document.getElementById('dictionary-tbody');
const dictTable = document.querySelector('.dict-table');
let dictionaryData = [];
function saveDictionary() {
    localStorage.setItem('userDictionary', JSON.stringify(dictionaryData));
}
function createWordRow(item) {
    if (!dictTbody) return;
    const tr = document.createElement('tr');
    const wordTd = document.createElement('td');
    const transTd = document.createElement('td');
    const actionTd = document.createElement('td');
    const delBtn = document.createElement('button');
    wordTd.textContent = item.word;
    transTd.textContent = item.translation;
    delBtn.textContent = 'Удалить';
    delBtn.setAttribute('type', 'button');
    delBtn.setAttribute('aria-label', `Удалить слово ${item.word}`);
    delBtn.classList.add('delete-word-btn');
    delBtn.addEventListener('click', () => {
        tr.remove();
        const index = dictionaryData.indexOf(item);
        if (index !== -1) {
            dictionaryData.splice(index, 1);
            saveDictionary();
        }
    });
    actionTd.appendChild(delBtn);
    tr.appendChild(wordTd);
    tr.appendChild(transTd);
    tr.appendChild(actionTd);
    dictTbody.appendChild(tr);
}
if (dictTbody && dictTable) {
    const savedWords = localStorage.getItem('userDictionary');
    if (savedWords !== null) {
        dictionaryData = JSON.parse(savedWords);
    } else {
        dictionaryData = [
            { word: '¡Vamos!', translation: 'Вперёд!' },
            { word: 'Puente', translation: 'Мост' }
        ];
        saveDictionary();
    }
    dictionaryData.forEach(item => createWordRow(item));
} else {
    console.error("Ошибка: таблица словаря или её тело (#dictionary-tbody) не найдены.");
}
if (addWordBtn) {
    addWordBtn.addEventListener('click', () => {
        if (!dictTbody) {
            console.error("Невозможно добавить слово: отсутствует #dictionary-tbody.");
            return;
        }
        const newWord = prompt("Введите новое слово:");
        if (!newWord || newWord.trim() === "") return;
        const newTranslation = prompt(`Введите перевод для слова «${newWord.trim()}»:`);
        if (!newTranslation || newTranslation.trim() === "") return;
        const wordObj = {
            word: newWord.trim(),
            translation: newTranslation.trim()
        };
        dictionaryData.push(wordObj);
        createWordRow(wordObj);
        saveDictionary();
    });
} else {
    console.error("Ошибка: кнопка добавления слова (#add-word-btn) не найдена.");
}
if (toggleDictBtn && dictContainer) {
    toggleDictBtn.setAttribute('aria-expanded', 'true');
    toggleDictBtn.addEventListener('click', () => {
        const isHidden = dictContainer.classList.toggle('hidden');
        toggleDictBtn.textContent = isHidden ? '👁️ Показать словарь' : '👁️ Скрыть словарь';
        toggleDictBtn.setAttribute('aria-expanded', String(!isHidden));
    });
} else {
    console.error("Ошибка: кнопка скрытия (#toggle-dict-btn) или контейнер (#dictionary-container) не найдены.");
}
if (clearDictBtn) {
    clearDictBtn.addEventListener('click', () => {
        if (!dictTbody) {
            console.error("Невозможно очистить словарь: отсутствует #dictionary-tbody.");
            return;
        }
        const allRows = dictTbody.querySelectorAll('tr');
        if (allRows.length === 0) {
            alert("Словарь уже пуст!");
            return;
        }
        allRows.forEach(row => row.remove());
        dictionaryData = [];
        saveDictionary();
    });
} else {
    console.error("Ошибка: кнопка очистки словаря (#clear-dict-btn) не найдена.");
}