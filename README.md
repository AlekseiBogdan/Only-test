Задание выполнено при помощи HTML5, CSS3, JS (vanilla)

Фоновое изображение привязано к body при помощи CSS

```css
body {
    width: 100vw;
    height: 100vh;
    background-image: url("../assets/images/carnaby-82KWr7KHwDg-unsplash 1.png");
    background-position-y: 20%;
    background-position-x: center;
    background-repeat: no-repeat;
}
```

Поверх изображения наложен div черного цвета с opacity 0.4, занимающий весь доступный экран; используется в дальнейшем в скрипте JS для "закрытия" кнопок

```html
<div id="bg"></div>
```

```css
#bg {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background-color: #020F20;
    opacity: 0.4;
}
```

Кнопки реализованы через checkbox, имеют типовой вид с отличием лишь в названиях классов и id

```html
<input class="checks" id="first-green-check" type="checkbox">
<label class="label-check green-check" id="first-green-check-label" for="first-green-check">
    <span id="first-check-span">Стадион</span>
</label>
```

Сами input'ы имеют стиль visibility: hidden, все внешние изменения происходят с label и span внутри

Стили label заданы как в общем стиле, так и в отдельных классах в зависимости от цвета кнопки

```css
.label-check {
    display: inline-block;
    width: 41px;
    height: 41px;
    border-radius: 41px;
    border: none;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 0V10M0 5H10" stroke="white" stroke-width="2"/></svg>');
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.7;
    color: #FFF;
}

.green-check {
    background-color: #6ABF4B;
}

.blue-check {
    background-color: #3877EE;
}
```

Label имеют position fixed и в зависимости от ширины экрана распологаются немного в разных местах, чтобы соответствовать расположению в приблизительно одном месте

```css
#first-green-check-label {
    transition: 100ms ease-out;
    z-index: 2;
    position: fixed;
}

#first-green-check-label {
    top: 482px;
    left: 36%;
}
```

Расположение label в зависимости от ширины экрана реализовано через media запросы

```css
@media only screen and (min-width: 1280px) and (max-width: 1439px) {
    #first-green-check-label {
        top: 482px;
        left: 30%;
    }

@media (min-width: 1440px) and (max-width: 1599px) {
    #first-green-check-label {
        top: 482px;
        left: 30%;
    }

@media (min-width: 1600px) and (max-width: 1920px){
    #first-green-check-label {
        top: 482px;
        left: 36%;
    }
```

Изменения label происходят при помощи CSS (за исключением ширины label и видимости span, что выичсляется и меняется в скрипте JS)

```css
#first-green-check:checked + #first-green-check-label {
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 1;
    transition: 100ms ease-out;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" viewBox="0 0 10 2" fill="none"><path d="M0 1H10" stroke="white" stroke-width="2"/></svg>');
    background-repeat: no-repeat;
    background-position: left 16px center;
    font-family: Arial;
    font-size: 14px;
    font-weight: 400;
    color: #FFF;
}
```

**Скрипт JS**

По загрузке окна инициализируется функция initializeCheckboxWidth, в которую подгружаются Object'ы: все label, все input, span и div бэкграунд

```javascript
window.onload = function() {
    initializeCheckboxWidth(
        document.getElementsByClassName("label-check"),
        document.getElementsByTagName("input"),
        document.getElementsByTagName("span"),
        document.getElementById("bg"),
    );
};
```

Внутри функции уже добавляются event listeners (на click он один — для background div!), все values из Object добавляются в массивы, создается массив с длиной всех span (для динамического вычисления ширины открытой кнопки, так как по тз текст внутри может быть любым => любого размера), причем к длине уже добавляется 55 для того, чтобы текст вмещался в кнопку

```javascript
    let labelList = Object.values(labels);

    let inputList = Object.values(inputs);

    let texts = Object.values(spans);

    let spanListWidth = [];

    bg.addEventListener("click", (event) => {labelWidthBackward()});
    
    labelList.forEach((item)  => item.addEventListener("transitionstart", (event) => changeLabelWidth(item)));

    texts.forEach((item) => spanListWidth.push(item.getBoundingClientRect().width + 55));
```

Сама функция changeLabelWidth, по старту анимации изменения label, записывает в переменную currentSpan тот span, который относится к label, поступающему на вход. Затем берется значение из массива длин span, соответствующее необходимому span и высчитывается boolean, отмечен ли input (необходимо в функции для закрытия кнопок по нажатии на фон).

Если input отмечен, то меняем ширину label на полученную ранее и меняем видимость span, иначе скрыть span и вернуть ширину к исходным 41 пикселю (else необходим, так как существует обратный transition)

```javascript
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
```

Функция lastBlueCheckOnTheRight проверяет крайную правую синюю кнопку, так как в зависимости от ширины экрана может быть неудобно и невозможно открыть кнопку и прочитать содержимое, поэтому в случае, если ширина экрана меньше 1600 пикселей мы смещаем кнопку и немного меняем ее стили для адекватного отображения содержимого.

В первую очередь мы записываем ширину экрана в константу, затем проверяем, что label именно крайний правый синий и что ширина экрана именно та, при которой необходимо изменить стили. Если все совпало и checkbox отмечен, изменяем стиль label, смещаем его и меняем позиционирование span внутри него. Иначе позиционируем кнопку в одном месте и сбрасываем остальные стили.

```javascript
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
```

Функция labelWidthBackward, вызываемая кликом по фоновому div, возвращает все кнопки к изначальному «закрытому» состоянию и возвращает их ширину к исходному значению посредоством цикла, проходясь по каждому checkbox.

```javascript
function labelWidthBackward() {
        for (let checkbox of inputList) {
            checkbox.checked = false;
            labelList[inputList.indexOf(checkbox)].style.width = "41px";
        }
    }
```

