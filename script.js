const userName = prompt("Как вас зовут?", "Студент");
alert(`Привет, ${userName}! Добро пожаловать в дневник языкового энтузиаста.`);

const wordsPerDay = [15, 55, 8, 42, 60, 5, 30]; 

function getSum(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

function getMax(arr) {
    let max = arr[0];
    for (let num of arr) {
        if (num > max) {
            max = num;
        }
    }
    return max;
}

function filterHighProgress(arr) {
    return arr.filter(words => words > 50);
}

const totalWords = getSum(wordsPerDay);
const maxWords = getMax(wordsPerDay);
const highProgressDays = filterHighProgress(wordsPerDay);

let lowProgressCount = 0;
for (let i = 0; i < wordsPerDay.length; i++) {
    if (wordsPerDay[i] <= 10) {
        lowProgressCount++;
    }
}

const lowProgressPercentage = (lowProgressCount / wordsPerDay.length) * 100;
const averageWords = totalWords / wordsPerDay.length;

alert(`Всего выучено ${totalWords} слов, в ${highProgressDays.length} днях прогресс был высоким.`);

console.log(`Статистика изучения языка`);
console.log(`Рекорд за один день: ${maxWords} слов.`);
console.log(`Дней с малым прогрессом (<= 10 слов): ${lowProgressCount}`);
console.log(`Процент дней с малым прогрессом: ${lowProgressPercentage.toFixed(1)}%`);

if (averageWords > 30) {
    console.log("Отличный темп изучения языка!");
} else {
    console.log(`Средний темп: ${averageWords.toFixed(1)} слов в день. Есть куда расти!`);
}