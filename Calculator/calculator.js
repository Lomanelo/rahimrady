const display = document.getElementById("display");



function appendToDisplay(input){
  if (display.value === "Error") {
    clearDisplay();
  }
  display.value += input;
}



function clearDisplay(){
  display.value = "";
}

function calculate() {
    try {
        // Replace 'x' with '*' for multiplication
        let expression = display.value.replace(/×/g, '*');
        
        // Evaluate the expression
        let result = eval(expression);
        
        // Check if the result is a finite number
        if (!isFinite(result)) {
            throw new Error("Invalid calculation");
        }
        
        // Round the result to a reasonable number of decimal places
        display.value = parseFloat(result.toFixed(8));
    } catch (error) {
        display.value = "Error";
    }
}

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (/[0-9+\-*/.=]/.test(key)) {
        event.preventDefault();
        if (key === '=') {
            calculate();
        } else if (key === '*') {
            appendToDisplay('×');
        } else {
            appendToDisplay(key);
        }
    } else if (key === 'Enter') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        event.preventDefault();
        display.value = display.value.slice(0, -1);
    } else if (key === 'Escape') {
        event.preventDefault();
        clearDisplay();
    }
});






