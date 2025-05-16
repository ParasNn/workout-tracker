
const decreaseBtn = document.getElementById("decreaseBtn");
const increaseBtn = document.getElementById("increaseBtn");
const resetBtn = document.getElementById("resetBtn");
const counter = document.getElementById("countVal");

let count = 0;

decreaseBtn.onclick = function () {
    count--;
    counter.textContent = count;
}
increaseBtn.onclick = function () {
    count++;
    counter.textContent = count;
}
resetBtn.onclick = function () {
    count = 0;
    counter.textContent = count;
}