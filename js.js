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