// Глобальні змінні
let examples = []; // Масив для збереження всіх прикладів
let currentExample = 0; // Індекс поточного прикладу
let startTime; // Час початку гри або поточного прикладу
let endTime; // Час закінчення гри
let answerTimes = []; // Масив часу на кожну відповідь
let timerInterval; // Ідентифікатор інтервалу таймера

// Початкові налаштування відсотків
let settings = {
    multiplicationPercent: 35,  // Відсоток прикладів на множення
    divisionPercent: 50,        // Відсоток прикладів на ділення
    additionPercent: 5,         // Відсоток прикладів на додавання
    subtractionPercent: 10      // Відсоток прикладів на віднімання
};

// Збережені налаштування для скидання до початкового стану
let savedSettings = {...settings};

// Генерація прикладів на основі відсоткових налаштувань
function generateExamples(count) {
    examples = []; // Очищення попередніх прикладів

    // Типи прикладів з відповідними генераторами
    const types = [
        { name: "division", percent: settings.divisionPercent, generator: generateDivisionExample },
        { name: "multiplication", percent: settings.multiplicationPercent, generator: generateMultiplicationExample },
        { name: "addition", percent: settings.additionPercent, generator: generateAdditionExample },
        { name: "subtraction", percent: settings.subtractionPercent, generator: generateSubtractionExample }
    ];

    // Генерація прикладів для кожного типу
    types.forEach(type => {
        const typeCount = Math.ceil(count * (type.percent / 100)); // Розрахунок кількості прикладів для цього типу
        for (let i = 0; i < typeCount; i++) {
            let example;
            do {
                example = type.generator(); // Генерація прикладу
            } while (example.answer >= 200 || example.answer < 0); // Перевірка коректності відповіді
            examples.push(example); // Додавання прикладу до масиву
        }
    });

    // Перемішування прикладів для випадкового порядку
    examples = examples.sort(() => Math.random() - 0.5);
}

// Генерація прикладу ділення
function generateDivisionExample() {
    const divisors = [8, 12, 14, 16]; // Можливі дільники
    let b = divisors[Math.floor(Math.random() * divisors.length)]; // Випадковий вибір дільника
    let quotient = Math.floor(Math.random() * (200 / b)) + 5; // Випадкове обчислення частки
    let a = b * quotient; // Обчислення діленого

    // Перевірка на те, чи знаходиться ділене в межах 40-200
    while (a < 40 || a > 200) {
        quotient = Math.floor(Math.random() * (200 / b)) + 5;
        a = b * quotient;
    }

    let question = `${a} / ${b} = `; // Формулювання питання
    let answer = a / b; // Обчислення правильної відповіді
    return { question, answer, userAnswer: null, isCorrect: false };
}

// Генерація прикладу множення
function generateMultiplicationExample() {
    let a = Math.floor(Math.random() * 64) + 3; // Випадковий множник
    let b = Math.floor(Math.random() * (200 / a)) + 3; // Випадковий множник
    let question = `${a} * ${b} = `; // Формулювання питання
    let answer = a * b; // Обчислення правильної відповіді
    return { question, answer, userAnswer: null, isCorrect: false };
}

// Генерація прикладу додавання
function generateAdditionExample() {
    let a = Math.floor(Math.random() * 191) + 10; // Доданок, не менше 10
    let b = Math.floor(Math.random() * (200 - a)) + 10; // Доданок, не менше 10
    let question = `${a} + ${b} = `; // Формулювання питання
    let answer = a + b; // Обчислення правильної відповіді
    return { question, answer, userAnswer: null, isCorrect: false };
}

// Генерація прикладу віднімання
function generateSubtractionExample() {
    let a = Math.floor(Math.random() * 191) + 10; // Зменшуване, не менше 10
    let b = Math.floor(Math.random() * (a - 9)) + 10; // Від'ємник, не менше 10
    let question = `${a} - ${b} = `; // Формулювання питання
    let answer = a - b; // Обчислення правильної відповіді
    return { question, answer, userAnswer: null, isCorrect: false };
}

// Початок гри
function startGame() {
    const numExamples = document.getElementById("numExamples").value; // Отримання кількості прикладів від користувача
    generateExamples(numExamples); // Генерація прикладів
    currentExample = 0; // Скидання індексу поточного прикладу
    answerTimes = []; // Очищення масиву часу відповідей
    document.getElementById("block1").style.display = "none"; // Приховування блоку початку гри
    document.getElementById("block2").style.display = "block"; // Відображення блоку гри
    document.getElementById("result").style.display = "none"; // Приховування блоку результатів
    document.getElementById("stats").style.display = "none"; // Приховування блоку статистики
    document.getElementById("actions").style.display = "none"; // Приховування блоку дій
    showExample(); // Показ першого прикладу
    startTime = new Date(); // Запуск таймера
    timerInterval = setInterval(updateTimer, 1000); // Оновлення таймера щосекунди
}

// Оновлення таймера
function updateTimer() {
    const currentTime = Math.floor((new Date() - startTime) / 1000); // Обчислення поточного часу
    document.getElementById("timer").textContent = `Час: ${currentTime} сек`; // Відображення часу на екрані
}

// Показ наступного прикладу
function showExample() {
    if (currentExample < examples.length) {
        document.getElementById("question").textContent = examples[currentExample].question; // Відображення питання
        document.getElementById("answer").value = ""; // Очищення поля відповіді
        document.getElementById("answer").focus(); // Переміщення фокусу на поле відповіді
    } else {
        endTime = new Date(); // Запис часу завершення гри
        clearInterval(timerInterval); // Зупинка таймера
        showStats(); // Відображення статистики гри
    }
}

// Обробка відповіді користувача
function submitAnswer() {
    const userAnswer = document.getElementById("answer").value; // Отримання відповіді від користувача
    examples[currentExample].userAnswer = parseInt(userAnswer); // Запис відповіді користувача
    examples[currentExample].isCorrect = examples[currentExample].userAnswer === examples[currentExample].answer; // Перевірка правильності відповіді
    answerTimes.push((new Date() - startTime) / 1000); // Запис часу відповіді
    startTime = new Date(); // Перезапуск таймера для наступного питання
    currentExample++; // Перехід до наступного прикладу
    showExample(); // Показ наступного прикладу
}

// Показ статистики гри
function showStats() {
    document.getElementById("block2").style.display = "none"; // Приховування блоку гри
    const correct = examples.filter(ex => ex.isCorrect).length; // Підрахунок правильних відповідей
    const incorrect = examples.length - correct; // Підрахунок неправильних відповідей
    const totalTime = answerTimes.reduce((a, b) => a + b, 0); // Обчислення загального часу
    const avgTimePerExample = totalTime / examples.length; // Обчислення середнього часу на приклад

    // Формування HTML-коду для статистики
    let statsHTML = `
        <p>Правильних відповідей: ${correct}</p>
        <p>Неправильних відповідей: ${incorrect}</p>
        <p>Загальний час: ${totalTime.toFixed(2)} секунд</p>
        <p>Середній час на один приклад: ${avgTimePerExample.toFixed(2)} секунд</p>
    `;
    document.getElementById("stats").innerHTML = statsHTML; // Відображення статистики
    document.getElementById("stats").style.display = "block"; // Показ блоку статистики

    // Формування HTML-коду для результатів кожного прикладу
    let resultHTML = "";
    examples.forEach((ex, index) => {
        const resultClass = ex.isCorrect ? "correct" : "incorrect"; // Визначення класу для правильних та неправильних відповідей
        resultHTML += `<p class="${resultClass}">${ex.question} ${ex.userAnswer} (правильна відповідь: ${ex.answer}, час: ${answerTimes[index].toFixed(2)} секунд)</p>`;
    });
    document.getElementById("result").innerHTML = resultHTML; // Відображення результатів
    document.getElementById("result").style.display = "block"; // Показ блоку результатів

    document.getElementById("actions").style.display = "block"; // Показ блоку дій (наприклад, повторити тест)
}

// Повторення тесту
function retryTest() {
    document.getElementById("block1").style.display = "block"; // Показ блоку початку гри
    document.getElementById("result").style.display = "none"; // Приховування блоку результатів
    document.getElementById("stats").style.display = "none"; // Приховування блоку статистики
    document.getElementById("actions").style.display = "none"; // Приховування блоку дій
}

// Робота над помилками (повторення тільки неправильних відповідей)
function retryMistakes() {
    examples = examples.filter(ex => !ex.isCorrect); // Фільтрація тільки неправильних відповідей
    currentExample = 0; // Скидання індексу поточного прикладу
    answerTimes = []; // Очищення масиву часу відповідей
    document.getElementById("result").style.display = "none"; // Приховування блоку результатів
    document.getElementById("stats").style.display = "none"; // Приховування блоку статистики
    document.getElementById("actions").style.display = "none"; // Приховування блоку дій
    document.getElementById("block2").style.display = "block"; // Показ блоку гри
    showExample(); // Показ першого прикладу з помилками
    startTime = new Date(); // Запуск таймера
    timerInterval = setInterval(updateTimer, 1000); // Оновлення таймера щосекунди
}

// Переключення між налаштуваннями та початком гри
function toggleSettings() {
    const settingsDiv = document.getElementById("settings"); // Блок налаштувань
    const block1Div = document.getElementById("block1"); // Блок початку гри
    if (settingsDiv.style.display === "none") {
        settingsDiv.style.display = "block"; // Показ налаштувань
        block1Div.style.display = "none"; // Приховування блоку початку гри
        document.getElementById("backToGame").style.display = "block"; // Показ кнопки "Повернутися до гри"
        document.getElementById("resetSettings").style.display = "block"; // Показ кнопки "Скинути налаштування"
        document.getElementById("saveSettings").style.display = "none"; // Приховування кнопки "Зберегти налаштування"
        document.getElementById("discardChanges").style.display = "none"; // Приховування кнопки "Відхилити"
        
        // Відновлення збережених значень налаштувань
        document.getElementById("multiplicationCount").value = settings.multiplicationPercent;
        document.getElementById("divisionCount").value = settings.divisionPercent;
        document.getElementById("additionCount").value = settings.additionPercent;
        document.getElementById("subtractionCount").value = settings.subtractionPercent;
    } else {
        settingsDiv.style.display = "none"; // Приховування налаштувань
        block1Div.style.display = "block"; // Показ блоку початку гри
    }
}

// Скидання налаштувань до початкових значень
function resetSettings() {
    settings = {
        multiplicationPercent: 35, // Початкове значення для множення
        divisionPercent: 50,       // Початкове значення для ділення
        additionPercent: 5,        // Початкове значення для додавання
        subtractionPercent: 10     // Початкове значення для віднімання
    };
    savedSettings = {...settings}; // Оновлення збережених налаштувань
    toggleSettings(); // Перехід до початкового стану налаштувань
}

// Збереження налаштувань користувача
function saveSettings() {
    const multiplicationPercent = parseInt(document.getElementById("multiplicationCount").value); // Отримання значення для множення
    const divisionPercent = parseInt(document.getElementById("divisionCount").value); // Отримання значення для ділення
    const additionPercent = parseInt(document.getElementById("additionCount").value); // Отримання значення для додавання
    const subtractionPercent = parseInt(document.getElementById("subtractionCount").value); // Отримання значення для віднімання

    const totalPercent = multiplicationPercent + divisionPercent + additionPercent + subtractionPercent; // Обчислення загальної суми відсотків

    if (totalPercent !== 100) {
        document.getElementById("error-message").style.display = "block"; // Відображення повідомлення про помилку, якщо сума відсотків не дорівнює 100
        return;
    }

    // Збереження нових значень налаштувань
    settings.multiplicationPercent = multiplicationPercent;
    settings.divisionPercent = divisionPercent;
    settings.additionPercent = additionPercent;
    settings.subtractionPercent = subtractionPercent;

    savedSettings = {...settings}; // Оновлення збережених налаштувань
    document.getElementById("error-message").style.display = "none"; // Приховування повідомлення про помилку
    toggleSettings(); // Повернення до початкового стану налаштувань
}

// Відхилення змін та повернення до попередніх налаштувань
function discardChanges() {
    toggleSettings(); // Повернення до попередніх налаштувань
}

// Обробка введення користувача для відображення відповідних кнопок
document.querySelectorAll('#multiplicationCount, #divisionCount, #additionCount, #subtractionCount').forEach(input => {
    input.addEventListener('input', () => {
        document.getElementById("backToGame").style.display = "none"; // Приховування кнопки "Повернутися до гри"
        document.getElementById("resetSettings").style.display = "block"; // Показ кнопки "Скинути налаштування"
        document.getElementById("saveSettings").style.display = "block"; // Показ кнопки "Зберегти налаштування"
        document.getElementById("discardChanges").style.display = "block"; // Показ кнопки "Відхилити"
    });
});
