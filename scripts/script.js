const calculatorScreen = document.querySelector("#screen");
const acButton = document.querySelector("#ac");
const signButton = document.querySelector("#sign");
const percentButton = document.querySelector("#percent");
const backButton = document.querySelector("#back");
const numButtons = document.querySelectorAll(".num");
const decimalButton = document.querySelector("#dec");
const operationButtons = document.querySelectorAll(".op");

let showFullEquation = true;

let calculatorSequence = [0]; // max length of 3 | example 1: [3, +, 5] | example 2: [2, *, 8]
let pressedEquals = false;

const containsValueSingle = (value, match) => {
    return !(String(value).length != 1 || !String(match).split("").includes(value));
};

const updateScreen = () => {
    if (showFullEquation) calculatorScreen.textContent = calculatorSequence.join(" ");
    else calculatorScreen.textContent = String(calculatorSequence[calculatorSequence.length - 1]);
}

const resetCalculator = () => {
    calculatorSequence = [0];
    updateScreen();
}

const generateErrorMessage = () => {
    let errorMessages = [
        "ꉂ (´∀｀)ʱªʱªʱª", "ヽ༼ຈل͜ຈ༽ﾉ","༼ಢ_ಢ༽","(づ ՞ਊ ՞ )づ",
        "（ ´థ౪థ）","(ノಠ益ಠ)ノ彡┻━┻","(∩｀-´)⊃━☆ﾟ.*･｡ﾟ","(´⊙ω⊙`)！",
        "ლ(́◉◞౪◟◉‵ლ)","(◐ω◑ )","ε=ε=(っ* ´□` )っ","=͟͟͞͞ =͟͟͞͞ ﾍ ( ´ Д `)ﾉ",
        "( ╥ω╥ )","ヽ༼ ಠ益ಠ ༽ﾉ","＼＼\\٩(๑`^´๑)۶//／／","┌(▀Ĺ̯ ▀-͠ )┐",
        "( ͡° ͜ʖ├┬┴┬┴", "*:・ﾟ ₍ᐢ•ﻌ•ᐢ₎*:・ﾟ", "(๑✪ᆺ✪๑)", "( ;ↀ⌓ↀ)",
    ];
    return errorMessages[Math.floor(Math.random() * errorMessages.length)];
}

/*##############################
||      FUNCTION BUTTONS      ||
##############################*/
acButton.addEventListener("click", () => {
    resetCalculator();
});

signButton.addEventListener("click", () => {
    invertOperation();
});

percentButton.addEventListener("click", () => {
    percentOperation();
});

backButton.addEventListener("click", () => {
    backOperation();
});

const invertOperation = () => {
    let lastSequenceValue = calculatorSequence[calculatorSequence.length - 1];
    if (String(lastSequenceValue).charAt(lastSequenceValue.length - 1) === ".") {
        calculatorSequence[calculatorSequence.length - 1] = String(lastSequenceValue).slice(0, lastSequenceValue.length - 1);
        updateScreen();
    }
    
    if (lastSequenceValue != "0") {
        if (calculatorSequence.length == 1 || calculatorSequence.length == 2) invertToggleAtIndex(0);
        else if (calculatorSequence.length == 3) invertToggleAtIndex(2);
        else {
            resetCalculator();
            throw new Error("Invalid length");
        }
    }
};

const invertToggleAtIndex = index => {
    if (String(calculatorSequence[index]).charAt(0) == "-") calculatorSequence[index] = String(calculatorSequence[index]).slice(1);
    else calculatorSequence[index] = "-".concat(String(calculatorSequence[index]));
    if (showFullEquation) calculatorScreen.textContent = calculatorSequence.join(" ");
    else calculatorScreen.textContent = calculatorSequence[index];
};

const percentOperation = () => {
    let lastSequenceValue = calculatorSequence[calculatorSequence.length - 1];
    if (lastSequenceValue != "0") {
        if (calculatorSequence.length == 1 || calculatorSequence.length == 2) {
            calculatorSequence[0] /= 100;
            if (showFullEquation) calculatorScreen.textContent = calculatorSequence.join(" ");
            else calculatorScreen.textContent = calculatorSequence[0];
        } else if (calculatorSequence.length == 3) {
            calculatorSequence[2] /= 100;
            if (showFullEquation) calculatorScreen.textContent = calculatorSequence.join(" ");
            else calculatorScreen.textContent = calculatorSequence[2];
        } else {
            resetCalculator();
            throw new Error("Invalid length");
        }
    }
};

const backOperation = () => {
    if (calculatorSequence.length == 1 || calculatorSequence.length == 2) {
        if (calculatorSequence[0] != "0") {
            calculatorSequence[0] = String(calculatorSequence[0]).slice(0, calculatorSequence[0].length - 1);
            if (calculatorSequence[0] == "" || calculatorSequence[0] == "-") calculatorSequence[0] = 0;
            if (showFullEquation) calculatorScreen.textContent = calculatorSequence.join(" ");
            else calculatorScreen.textContent = calculatorSequence[0];
        }
    } else if (calculatorSequence.length == 3) {
        if (calculatorSequence[0] != "0") {
            calculatorSequence[2] = String(calculatorSequence[2]).slice(0, calculatorSequence[2].length - 1);
            if (calculatorSequence[2] == "" || calculatorSequence[2] == "-") calculatorSequence[2] = 0;
            if (showFullEquation) calculatorScreen.textContent = calculatorSequence.join(" ");
            else calculatorScreen.textContent = calculatorSequence[2];
        }
    } else {
        resetCalculator();
        throw new Error("Invalid length");
    }
};

/*##############################
||       NUMBER BUTTONS       ||
##############################*/
numButtons.forEach(item => {
    item.addEventListener("click", () => {
        startNum(item.id);
    });
});

const startNum = value => {
    let number = value;
    if (containsValueSingle(number, "0123456789")) {
        updateNum(number);
        pressedEquals = false;
    }
};

const updateNum = num => {
    let lastSequenceValue = calculatorSequence[calculatorSequence.length - 1];
    if (lastSequenceValue == "0" || pressedEquals) {
        calculatorSequence[calculatorSequence.length - 1] = num;
    } else if (containsValueSingle(lastSequenceValue, "+-x/")) {
        calculatorSequence.push(num);
    } else {
        calculatorSequence[calculatorSequence.length - 1] += num;
    }
    updateScreen();
};

decimalButton.addEventListener("click", () => { 
    decimalOperation();
});

const decimalOperation = () => {
    let lastSequenceValue = calculatorSequence[calculatorSequence.length - 1];
    if (lastSequenceValue === 0 || !containsValueSingle(".", lastSequenceValue)) {
        calculatorSequence[calculatorSequence.length - 1] += ".";
    } else if (containsValueSingle(lastSequenceValue, "+-x/")) {
        calculatorSequence.push("0.");
    }
    updateScreen();
};

/*##############################
||     OPERATION BUTTONS      ||
##############################*/
operationButtons.forEach(item => {
    item.addEventListener("click", () => {
        startOperation(item.id)
    });
});

const startOperation = value => {
    let operation = value;
    pressedEquals = false;
    if (containsValueSingle(operation, "+-x/=")) {
        calculateOperation(operation);
    }
};

const calculateOperation = operator => {
    let lastSequenceValue = String(calculatorSequence[calculatorSequence.length - 1]);
    if (String(lastSequenceValue).charAt(lastSequenceValue.length - 1) === ".") {
        calculatorSequence[calculatorSequence.length - 1] = String(lastSequenceValue).slice(0, lastSequenceValue.length - 1);
        updateScreen();
    }

    if (calculatorSequence.length == 1) { // example: [3]
        if(operator != "=") calculatorSequence.push(operator);
        else if (operator == "=") pressedEquals = true;
        if (showFullEquation) updateScreen(); 

    } else if (calculatorSequence.length == 2) { // example: [3, +]
        if (containsValueSingle(operator, "+-x/")) calculatorSequence[calculatorSequence.length - 1] = operator;
        else if (containsValueSingle(operator, "=")) calculatorSequence.pop();
        if (showFullEquation) updateScreen(); 
    
    } else if (calculatorSequence.length == 3) { // example: [3, +, 5]
        if (calculatorSequence[1] == "+") calculatorSequence = [(Number(calculatorSequence[0]) + Number(calculatorSequence[2])).toFixed(15) * 1];
        else if (calculatorSequence[1] == "-") calculatorSequence = [(Number(calculatorSequence[0]) - Number(calculatorSequence[2])).toFixed(15) * 1];
        else if (calculatorSequence[1] == "x") calculatorSequence = [(Number(calculatorSequence[0]) * Number(calculatorSequence[2])).toFixed(15) * 1];
        else if (calculatorSequence[1] == "/") {
            if (calculatorSequence[2] == 0) {
                resetCalculator();
                calculatorScreen.textContent = generateErrorMessage();
                return;
            } else calculatorSequence = [(Number(calculatorSequence[0]) / Number(calculatorSequence[2])).toFixed(15) * 1];
        } else {
            resetCalculator();
            throw new Error("Invalid operator");
        }
        updateScreen();

        if (operator != "=") calculatorSequence.push(operator);
        else if (operator == "=") pressedEquals = true;
        else {
            resetCalculator();
            throw new Error("Invalid operator");
        }
    } else {
        resetCalculator();
        throw new Error("Invalid length");
    }
};

/*##############################
||     KEYBOARD CONTROLS      ||
##############################*/

document.addEventListener("keydown", e => {
    if (e.key == "Escape") resetCalculator();
    else if (e.key == "i") invertOperation();
    else if (e.key == "p") percentOperation();
    else if (e.key == "/") startOperation("/"); 
    else if (e.key == "x" || e.key == "*") startOperation("x");
    else if (e.key == "-") startOperation("-");
    else if (e.key == "=" || e.key == "+") startOperation("+");
    else if (e.key == "Enter") startOperation("=");
    else if (e.key == "0") startNum("0");
    else if (e.key == "1") startNum("1");
    else if (e.key == "2") startNum("2");
    else if (e.key == "3") startNum("3");
    else if (e.key == "4") startNum("4");
    else if (e.key == "5") startNum("5");
    else if (e.key == "6") startNum("6");
    else if (e.key == "7") startNum("7");
    else if (e.key == "8") startNum("8");
    else if (e.key == "9") startNum("9");
    else if (e.key == ".") decimalOperation();
    else if (e.key == "Backspace") backOperation();
});