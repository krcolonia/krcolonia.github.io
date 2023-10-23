

function dropDownFunc() {
    var menu = document.querySelector(".headerDropdown");

    if(menu.style.top === "0px" || menu.style.top === "") {
        menu.style.top = "55px";
    }
    else {
        menu.style.top = "0px";
    }
}