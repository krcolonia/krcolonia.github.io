var dropdown_open = false;
function dropDownFunc() {
	var menu = document.getElementById("headerDropdown");

  if(window.innerWidth <= 768) {
    if(!dropdown_open) {
      menu.style.top = "55px";
			dropdown_open = true
    }
    else {
      menu.style.top = "-" + menu.offsetHeight + "px";
			dropdown_open = false
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