const calculatorScreen = document.querySelector("#screen");
const acButton = document.querySelector("#ac");
const signButton = document.querySelector("#sign");
const percentButton = document.querySelector("#percent");
const numButtons = document.querySelectorAll(".num");
const decimalButton = document.querySelector("#dec");
const operationButtons = document.querySelectorAll(".op");

let calculatorSequence = [0]; // max length of 3 | example 1: [3, +, 5] | example 2: [2, *, 8]
let pressedEquals = false;
const errorMessage = "bro...";

const containsValueSingle = (value, match) => {
    return !(String(value).length != 1 || !String(match).split("").includes(value));
};

const updateScreen = () => {
    calculatorScreen.textContent = calculatorSequence[calculatorSequence.length - 1];
}

const resetCalculator = () => {
    calculatorSequence = [0];
    updateScreen();
}

/*##############################
||      FUNCTION BUTTONS      ||
##############################*/
acButton.addEventListener("click", () => {
    resetCalculator();
});

signButton.addEventListener("click", () => {
    invertOperation();
    console.log(calculatorSequence);
});

const invertOperation = () => {
    let lastSequenceValue = calculatorSequence[calculatorSequence.length - 1];
    if (String(lastSequenceValue).charAt(lastSequenceValue.length - 1) === ".") {
        calculatorSequence[calculatorSequence.length - 1] = lastSequenceValue.slice(0, lastSequenceValue.length - 1);
        updateScreen();
    }
    
    if (lastSequenceValue != "0") {
        if (calculatorSequence.length == 1 || calculatorSequence.length == 2) {
            invertToggleAtIndex(0);
        } else if (calculatorSequence.length == 3) {
            invertToggleAtIndex(2);
        } else {
            resetCalculator();
            throw new Error("Invalid length");
        }
    }
};

const invertToggleAtIndex = index => {
    if (calculatorSequence[index].charAt(0) == "-") {
        calculatorSequence[index] = calculatorSequence[index].slice(1);
    } else {
        calculatorSequence[index] = "-".concat(String(calculatorSequence[index]));
    }
    calculatorScreen.textContent = calculatorSequence[index];
};

percentButton.addEventListener("click", () => {

});

/*##############################
||       NUMBER BUTTONS       ||
##############################*/
numButtons.forEach(item => {
    item.addEventListener("click", () => {
        let number = item.id;
        if (containsValueSingle(number, "0123456789")) {
            updateNum(number);
            pressedEquals = false;
        }
    });
});

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
    console.log(calculatorSequence);
};

decimalButton.addEventListener("click", () => { 
    addDecimal();
});

const addDecimal = () => {
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
        let operation = item.id;
        pressedEquals = false;
        if (containsValueSingle(operation, "+-x/=")) {
           startOperation(operation);
        }
        console.log(calculatorSequence);
    });
});

const startOperation = operator => {
    let lastSequenceValue = String(calculatorSequence[calculatorSequence.length - 1]);
    if (String(lastSequenceValue).charAt(lastSequenceValue.length - 1) === ".") {
        calculatorSequence[calculatorSequence.length - 1] = lastSequenceValue.slice(0, lastSequenceValue.length - 1);
        updateScreen();
    }

    if (calculatorSequence.length == 1) { // example: [3]
        if(operator != "=") calculatorSequence.push(operator);
        else if (operator == "=") pressedEquals = true;
    
    } else if (calculatorSequence.length == 2) { // example: [3, +]
        if (containsValueSingle(operator, "+-x/")) calculatorSequence[calculatorSequence.length - 1] = operator;
        else if (containsValueSingle(operator, "=")) calculatorSequence.pop();
    
    } else if (calculatorSequence.length == 3) { // example: [3, +, 5]
        if (calculatorSequence[1] == "+") calculatorSequence = [Number(calculatorSequence[0]) + Number(calculatorSequence[2])];
        else if (calculatorSequence[1] == "-") calculatorSequence = [Number(calculatorSequence[0]) - Number(calculatorSequence[2])];
        else if (calculatorSequence[1] == "x") calculatorSequence = [Number(calculatorSequence[0]) * Number(calculatorSequence[2])];
        else if (calculatorSequence[1] == "/") {
            if (calculatorSequence[2] == 0) {
                resetCalculator();
                calculatorScreen.textContent = errorMessage;
            } else calculatorSequence = [Number(calculatorSequence[0]) / Number(calculatorSequence[2])];
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