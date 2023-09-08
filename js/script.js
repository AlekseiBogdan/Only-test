"use strict"

function initializeCheckboxWidth(labels, inputs, spans, bg){
    let labelList = Object.values(labels);

    let inputList = Object.values(inputs);

    let texts = Object.values(spans);

    let spanListWidth = [];

    bg.addEventListener("click", (event) => {labelWidthBackward()});
    
    labelList.forEach((item)  => item.addEventListener("transitionstart", (event) => changeLabelWidth(item)));

    texts.forEach((item) => spanListWidth.push(item.getBoundingClientRect().width + 55));

    function changeLabelWidth(label) {
        let currentSpan = texts[labelList.indexOf(label)];

        const labelWidth = spanListWidth[labelList.indexOf(label)];

        const checkedBox = inputList[labelList.indexOf(label)].checked;

        if (checkedBox) {
            label.style.width = `${labelWidth}px`;
            currentSpan.style.visibility = "visible";
        }  else {
            currentSpan.style.visibility = "hidden"
            label.style.width = "41px";
        }
        
        lastBlueCheckOnTheRight(label);
    }

    function lastBlueCheckOnTheRight(label) {
        const viewportWidth = window.innerWidth;
        
        if (label.id == "sixth-blue-check-label" && viewportWidth < 1600) {
            if (checkedBox) {
                label.style.left = `${viewportWidth - labelWidth - 25}px`;
                label.style.justifyContent = "left";
                label.style.paddingLeft = "15px";
            } else {
                label.style.left = `${viewportWidth - 60}px`;
                label.style.paddingLeft = 0;
            }
        }
    }

    function labelWidthBackward() {
        for (let checkbox of inputList) {
            checkbox.checked = false;
            if (checkbox.checked == false) {
                labelList[inputList.indexOf(checkbox)].style.width = "41px";
            }
        }
    }
}

window.onload = function() {
    initializeCheckboxWidth(
        document.getElementsByClassName("label-check"),
        document.getElementsByTagName("input"),
        document.getElementsByTagName("span"),
        document.getElementById("bg"),
    );
};