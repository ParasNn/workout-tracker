
const myCheckBox = document.getElementById("myCheckBox");

const op1Btn = document.getElementById("op1Btn");
const op2Btn = document.getElementById("op2Btn");
const op3Btn = document.getElementById("op3Btn");

const mySubmit = document.getElementById("mySubmit");

const checkResult = document.getElementById("checkResult");
const buttonResult = document.getElementById("buttonResult");

mySubmit.onclick = function () {
    if (myCheckBox.checked) {
        checkResult.textContent = "Check box has been checked";
    }
    else {
        checkResult.textContent = "Check box has not been checked";
    }

    if (op1Btn.checked) {
        buttonResult.textContent = "Option 1 has been selected";
    }
    else if (op2Btn.checked) {
        buttonResult.textContent = "Option 2 has been selected";
    }
    else if (op3Btn.checked) {
        buttonResult.textContent = "Option 3 has been selected";
    }
    else {
        buttonResult.textContent = "No option has been selected";
    }
}