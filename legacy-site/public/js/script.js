function dropDownFunc() {
  var menu = document.querySelector(".headerDropdown");

  if(window.innerWidth <= 768) {
    if(menu.style.top === "0px" || menu.style.top === "") {
      menu.style.top = "55px";
    }
    else {
      menu.style.top = "0px";
    }
  }
}

var headStr = "<krColonia>";
let headIndx = 0;

function printHomeHeader() {
  if(headIndx < headStr.length){
    document.getElementById("headerContent").innerHTML += headStr[headIndx];
    headIndx++;
  }
  else {
    document.querySelector(".blinkCursor").style.animationPlayState = "running";
    return null;
  }
  setTimeout(printHomeHeader, 150);
}