document.addEventListener("mousemove", e => {
    const c = document.querySelector(".fake-cursor");
    c.style.left = e.clientX + "px";
    c.style.top = e.clientY + "px";
});

const sw = document.getElementById('theme-switch');
sw.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
});

const langs = ['lang-ru', 'lang-en', 'lang-es'];
let li = 0;
const langSw = document.getElementById('lang-switch');

langSw.addEventListener('click', () => {
    langs.forEach(l => document.body.classList.remove(l));
    li = (li + 1) % langs.length;
    document.body.classList.add(langs[li]);
});

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

document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'back-to-top') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});
const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
}