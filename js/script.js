let dropdown_open = false;
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

const headStr = "<krColonia>";
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

const dev_type = [ "Full Stack Web", "Mobile", "Software" ]
const el = document.querySelector("#devType");
const fx = new TextScramble(el);
let counter = 0;

const next = () => {
	fx.setText(dev_type[counter]).then(() => {
		setTimeout(next, 2500);
	});
	counter = (counter +1) % dev_type.length;
};