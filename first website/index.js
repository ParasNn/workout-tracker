document.getElementById("myH1").textContent = "Hello";
document.getElementById("myP").textContent = "This is a Paragraph";

let value;
document.getElementById("myButton").onclick = function () {
    value = document.getElementById("myText").value;
    document.getElementById("output").textContent = value;
}