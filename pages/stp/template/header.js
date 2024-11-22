fetch("/stp/template/header.html")
  .then((response) => response.text())
  .then((data) => document.querySelector("main").insertAdjacentHTML('beforebegin', data));