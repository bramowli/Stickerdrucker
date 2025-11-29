 const buttons = document.querySelectorAll("button");

function buttonHandler() {

  document.querySelector('style').textContent =
    `@media print {
        * { visibility: hidden;
            margin: 0;
            padding: 0;}
        img {

          visibility: visible;
          position: absolute;
          top: 0px;
          left: 0px;
          transform:translateY(-100%) rotate(90deg);
	      transform-origin: left bottom;
          display: block;
          width: 120px;
          height: 212px;
          }
      }`;

  if (window.print) {
    window.print();
  }
}

buttons.forEach(button => {
  button.addEventListener("click", buttonHandler);
});