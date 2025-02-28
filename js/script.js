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

// ? Credits to luthifbg for the JavaScript Scramble text script
// ? link to origin of Scramble text script: https://github.com/luthfibg/sebelaslvl/blob/main/js_scramble_text/scramble.js

const dev_type = [ "Web", "Mobile", "Game" ]
const el = document.querySelector("#devType");
const fx = new TextScramble(el);
let counter = 0;

const next = () => {
	fx.setText(dev_type[counter]).then(() => {
		setTimeout(next, 2500);
	});
	counter = (counter + 1) % dev_type.length;
};

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

// ? Retrieves the current year for the footer. Helps me not replace the copyright year manually
document.getElementById('footerYear').textContent = `2020 - ${new Date().getFullYear()}`;

const currentDate = new Date();
const pastDate = new Date("2002-12-20");

let yearsDifference = currentDate.getFullYear() - pastDate.getFullYear();

// ? If current month is less than birth month OR if current month is same as birthMonth, but current day is less than birthday
if (currentDate.getMonth() < pastDate.getMonth() || (currentDate.getMonth() === pastDate.getMonth() && currentDate.getDate() < pastDate.getDate())) {
  yearsDifference--;
}

document.getElementById('currentAge').textContent = yearsDifference;