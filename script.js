// ================================
// SMART CALCULATOR
// ================================

const display = document.getElementById("display");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");

let memory = 0;
let history = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

// ================================
// DISPLAY
// ================================

function appendValue(value) {

    if (display.value === "Error")
        display.value = "";

    const operators = ['+', '-', '*', '/', '%'];

    const last = display.value.slice(-1);

    if (operators.includes(last) && operators.includes(value))
        return;

    if (value === ".") {

        let current = display.value.split(/[+\-*/%]/).pop();

        if (current.includes("."))
            return;
    }

    display.value += value;

}

// ================================
// CLEAR
// ================================

function clearDisplay() {
    display.value = "";
}

// ================================
// DELETE
// ================================

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// ================================
// CALCULATE
// ================================

function calculate() {

    if (display.value.trim() === "")
        return;

    try {

        const expression = display.value;

        let result = Function('"use strict";return (' + expression + ')')();

        if (!isFinite(result))
            throw new Error();

        result = Number(result.toFixed(10));

        addHistory(expression, result);

        display.value = result;

    }

    catch {

        display.value = "Error";

    }

}

// ================================
// SCIENTIFIC FUNCTIONS
// ================================

function square() {

    const n = parseFloat(display.value);

    if (isNaN(n))
        return display.value = "Error";

    display.value = n * n;

}

function squareRoot() {

    const n = parseFloat(display.value);

    if (isNaN(n) || n < 0)
        return display.value = "Error";

    display.value = Math.sqrt(n);

}

function reciprocal() {

    const n = parseFloat(display.value);

    if (n === 0)
        return display.value = "Error";

    display.value = 1 / n;

}

function percentage() {

    const n = parseFloat(display.value);

    if (isNaN(n))
        return display.value = "Error";

    display.value = n / 100;

}

// ================================
// MEMORY FUNCTIONS
// ================================

function memoryAdd() {

    memory += Number(display.value) || 0;

}

function memorySubtract() {

    memory -= Number(display.value) || 0;

}

function memoryRecall() {

    display.value = memory;

}

function memoryClear() {

    memory = 0;

}

// ================================
// COPY
// ================================

function copyResult() {

    navigator.clipboard.writeText(display.value);

    alert("Copied!");

}

// ================================
// HISTORY
// ================================

function addHistory(exp, ans) {

    history.unshift(`${exp} = ${ans}`);

    if (history.length > 20)
        history.pop();

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    renderHistory();

}

function renderHistory() {

    if (!historyList) return;

    historyList.innerHTML = "";

    history.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        li.onclick = () => {

            display.value = item.split("=")[1].trim();

        };

        historyList.appendChild(li);

    });

}

function clearHistory() {

    history = [];

    localStorage.removeItem("calculatorHistory");

    renderHistory();

}

// ================================
// DARK MODE
// ================================

if (themeToggle) {

    themeToggle.onclick = () => {

        document.body.classList.toggle("dark");

    };

}

// ================================
// KEYBOARD SUPPORT
// ================================

document.addEventListener("keydown", function(e){

    const key = e.key;

    if ("0123456789+-*/.%()".includes(key))
        appendValue(key);

    else if (key === "Enter") {

        e.preventDefault();

        calculate();

    }

    else if (key === "Backspace")
        deleteLast();

    else if (key === "Escape")
        clearDisplay();

});

// ================================
// LOAD HISTORY
// ================================

renderHistory();
