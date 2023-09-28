// Define operator precedence and associativity
const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
    '^': 3, // Exponentiation has the highest precedence
};

const associativity = {
    '^': 'right', // Right-associative
    '+': 'left',
    '-': 'left',
    '*': 'left',
    '/': 'left',
};

function parseExpression(expression) {

    // Shunting Yard Algorithm
    const outputQueue = [];
    const operatorStack = [];

    const tokens = expression.match(/(?:\d+\.\d+|\d+|[+\-*/^()])/g);

    for (const token of tokens) {
        if (!isNaN(token)) {
            // Token is a number, push to the output queue
            outputQueue.push(parseFloat(token));
        } else if (token in precedence) {
            // Token is an operator
            while (
                operatorStack.length > 0 &&
                (precedence[token] < precedence[operatorStack[operatorStack.length - 1]] ||
                    (precedence[token] === precedence[operatorStack[operatorStack.length - 1]] &&
                        associativity[token] === 'left')) &&
                operatorStack[operatorStack.length - 1] !== '('
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === '(') {
            // Token is an opening parenthesis
            operatorStack.push(token);
        } else if (token === ')') {
            // Token is a closing parenthesis
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack[operatorStack.length - 1] === '(') {
                operatorStack.pop();
            }
        }
    }

    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue;
}

function evaluateExpression(expression) {
    const outputQueue = parseExpression(expression);
    const valueStack = [];

    for (const token of outputQueue) {
        if (!isNaN(token)) {
            // Token is a number, push to the value stack
            valueStack.push(token);
        } else if (token in precedence) {
            // Token is an operator, perform the operation and push the result back to the stack
            const operand2 = valueStack.pop();
            const operand1 = valueStack.pop();
            switch (token) {
                case '+':
                    valueStack.push(operand1 + operand2);
                    break;
                case '-':
                    valueStack.push(operand1 - operand2);
                    break;
                case '*':
                    valueStack.push(operand1 * operand2);
                    break;
                case '/':
                    valueStack.push(operand1 / operand2);
                    break;
                case '^':
                    valueStack.push(Math.pow(operand1, operand2));
                    break;
                default:
                    throw new Error('Invalid operator: ' + token);
            }
        }
    }

    if (valueStack.length !== 1) {
        throw new Error('Invalid expression');
    }

    return valueStack[0];
}

function evaluateExpressionWithSteps(expression) {
    const outputQueue = parseExpression(expression);
    const valueStack = [];
    const steps = [];

    for (const token of outputQueue) {
        if (!isNaN(token)) {
            // Token is a number, push to the value stack
            valueStack.push(token);
        } else if (token in precedence) {
            // Token is an operator, perform the operation and push the result back to the stack
            const operand2 = valueStack.pop();
            const operand1 = valueStack.pop();
            let result;
            switch (token) {
                case '+':
                    result = operand1 + operand2;
                    break;
                case '-':
                    result = operand1 - operand2;
                    break;
                case '*':
                    result = operand1 * operand2;
                    break;
                case '/':
                    result = operand1 / operand2;
                    break;
                case '^':
                    result = Math.pow(operand1, operand2);
                    break;
                default:
                    throw new Error('Invalid operator: ' + token);
            }
            valueStack.push(result);
            steps.push(`${operand1} ${token} ${operand2} = ${result}`);
        }
    }

    if (valueStack.length !== 1) {
        throw new Error('Invalid expression');
    }

    return { result: valueStack[0], steps };
}

function calculate() {
    const expression = document.getElementById('expression').value;

    try {

        // Example usage:
        // const expression = "2 + 3 * (4 - 1)^2";
        const result = evaluateExpression(expression);
        console.log(`Result: ${result}`);
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `<h2>Expression: ${expression}</h2>`;
        resultElement.innerHTML += `<h2>Result: ${result}</h2>`;

        const { result: resultWithSteps, steps } = evaluateExpressionWithSteps(expression);
        console.log(`Result with Steps: ${resultWithSteps}`);
        console.log("Steps:");

        const stepsElement = document.getElementById('steps');
        // stepsElement.innerHTML = '';
        stepsElement.innerHTML = `<h2>Steps:</h2>`;

        for (const step of steps) {
            console.log(step);
            stepsElement.innerHTML += `<h2 class="h2">${step}</h2>`;
        }

    } catch (error) {
        const resultElement = document.getElementById('result');
        resultElement.innerHTML = `<p>Expression: ${expression}</p>`;
        resultElement.innerHTML += `<p>Result: Invalid expression</p>`;

        const stepsElement = document.getElementById('steps');
        stepsElement.innerHTML = '';
    }
}