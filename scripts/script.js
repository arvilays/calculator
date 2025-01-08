const calculatorScreen = document.querySelector("#screen");
const acButton = document.querySelector("#ac");
const signButton = document.querySelector("#sign");
const numButtons = document.querySelectorAll(".num");
const decimalButton = document.querySelector("#dec");
const operationButtons = document.querySelectorAll(".op");

let calculatorSequence = [0]; // max length of 3 | example 1: [3, +, 5] | example 2: [2, *, 8]
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

});

/*##############################
||       NUMBER BUTTONS       ||
##############################*/
numButtons.forEach(item => {
    item.addEventListener("click", () => {
        let number = item.id;
        if (containsValueSingle(number, "0123456789")) {
            updateNum(number);
        }
    });
});

const updateNum = num => {
    let lastSequenceValue = calculatorSequence[calculatorSequence.length - 1];
    if (lastSequenceValue == "0") {
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
        if (containsValueSingle(operation, "+-x/=")) {
           startOperation(operation);
        }
        console.log(calculatorSequence);
    });
});

const startOperation = operation => {
    let lastSequenceValue = String(calculatorSequence[calculatorSequence.length - 1]);
    if (lastSequenceValue.charAt(lastSequenceValue.length - 1) === ".") {
        calculatorSequence[calculatorSequence.length - 1] = lastSequenceValue.slice(0, lastSequenceValue.length - 1);
        updateScreen();
    }

    if (calculatorSequence.length == 1) { // example: [3]
        if(operation != "=") {
            calculatorSequence.push(operation);
        }
    } else if (calculatorSequence.length == 2) { // example: [3, +]
        if (containsValueSingle(operation, "+-x/")) {
            calculatorSequence[calculatorSequence.length - 1] = operation;
        } else if (containsValueSingle(operation, "=")) {
            calculatorSequence.pop();
        }
    } else if (calculatorSequence.length == 3) { // example: [3, +, 5]
        if (operation == "+") addOperation();
        else if (operation == "-") subtractOperation();
        else if (operation == "x") multiplyOperation();
        else if (operation == "/") divideOperation();
        else if (operation == "=") startOperation(calculatorSequence[1]);
        else {
            resetCalculator();
            throw new Error("Invalid operator");
        }
    } else {
        resetCalculator();
        throw new Error("Invalid length");
    }
};

const addOperation = () => {
    calculatorSequence = [Number(calculatorSequence[0]) + Number(calculatorSequence[2])];
    updateScreen();
    calculatorSequence.push("+");
};

const subtractOperation = () => {
    calculatorSequence = [Number(calculatorSequence[0]) - Number(calculatorSequence[2])];
    updateScreen();
    calculatorSequence.push("-");
};

const multiplyOperation = () => {
    calculatorSequence = [Number(calculatorSequence[0]) * Number(calculatorSequence[2])];
    updateScreen();
    calculatorSequence.push("x");
};

const divideOperation = () => {
    if (calculatorSequence[2] == 0) {
        resetCalculator();
        calculatorScreen.textContent = errorMessage;
    } else {
        calculatorSequence = [Number(calculatorSequence[0]) / Number(calculatorSequence[2])];
        updateScreen();
        calculatorSequence.push("/");
    }
};