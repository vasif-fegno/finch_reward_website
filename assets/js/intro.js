/* Homepage: hide chrome during the opening, with a safety release */
document.documentElement.classList.add("intro");
setTimeout(function () { document.documentElement.classList.remove("intro"); }, 11000);
