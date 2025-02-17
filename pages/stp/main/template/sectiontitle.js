fetch("/stp/main/template/sectiontitle.html")
    .then((response) => response.text())
    .then((data) => document.querySelector("main").insertAdjacentHTML('afterbegin', data));