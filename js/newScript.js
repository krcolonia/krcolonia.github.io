//#region // ? Sidebar Functionality
var sidebarOpen = false;

function toggleSidebar() {
	const sidebarContainer = document.getElementById('sidebarContainer');
	const sidebar = document.getElementById('sidebarNav');
	const sidebarBtnIcon = document.getElementById('sidebarBtnIcon');

	if(sidebarOpen == true) {
		sidebarContainer.style.width = '42px';
		sidebar.style.left = '-208px';
		sidebarBtnIcon.src = 'images/sidebar-open.png';
		sidebarOpen = false;
	}
	else {
		sidebarContainer.style.width = '250px';
		sidebar.style.left = '0px';
		sidebarBtnIcon.src = "images/sidebar-close.png";
		sidebarOpen = true;
	}
}
//#endregion

//#region // ? In-site Tab Functionality
var currentTabs = [];
var activeTab = "Home";
var prevTab = "Home";

function addTab(tabName) {
	const tabContainer = document.getElementById('tabContainer');

	if (currentTabs.includes(tabName)) {
		setCurrentTab(tabName);
		toggleSidebar();
		return; // ? guard clause to check if the tab was already added
	}

	tabContainer.innerHTML += `
	<div class="menuTab d-flex flex-row justify-content-between align-content-center p-1" id="${tabName}Tab">
		<span class="flex-grow-1 mt-1" onClick="setCurrentTab('${tabName}')">${tabName}</span>
		<button class="tabClose my-auto d-flex" onClick="removeTab('${tabName}')">
			<img src="images/close.png">
		</button>
	</div>`;
	currentTabs.push(tabName);

	setCurrentTab(tabName); // ? set the newly added tab as the currently active tab.
}

function removeTab(tabName) {
	const tabToDelete = document.getElementById(`${tabName}Tab`);
	tabToDelete.remove();

	if(tabName === prevTab) prevTab = "Home";
	// ? ^ sets prev tab to home in the case that the tab you close is the set prevTab
	// ? ^ this is so that at least the code won't throw back a bunch of errors at me

	if(tabName == activeTab) {
		activeTab = prevTab;
		document.getElementById(`${activeTab}Tab`).classList.add("activeTab");
		setCurrentTab(prevTab); // ? sets current content to be prevTab's content
	};
	
	currentTabs = currentTabs.filter(e => e !== tabName); // ? removes tab based on tab name via array filtering
}

function setCurrentTab(tabName) {
	if (tabName != activeTab) {
		prevTab = activeTab;
	}
	activeTab = tabName;

	document.getElementById(`${prevTab}Tab`).classList.remove("activeTab");
	document.getElementById(`${activeTab}Tab`).classList.add("activeTab");

	setBodyContent(activeTab);
}
//#endregion

//#region // ? functions for changing the content of body
function setBodyContent(tabName) {
	const body = document.getElementById("mainBody");

	[...body.children]
  .forEach(child => child.id !== `${tabName}Content` ? child.style.display = 'none' : null);
	document.getElementById(`${tabName}Content`).style.display = 'block';

	if(tabName === "Home") {
		headIndx = 0;
		document.getElementById("headerContent").innerHTML = '';
		printHomeHeader();
	}
}

//#region // ? Home Tab Content
const headStr = "<krColonia>";
let headIndx = 0;

// ? Credits to luthifbg for the JavaScript Scramble text script
// ? link to origin of Scramble text script: https://github.com/luthfibg/sebelaslvl/blob/main/js_scramble_text/scramble.js

const dev_type = [ "Web", "Mobile", "Software" ]
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

next();
//#endregion

setBodyContent("Home"); // ? sets the body content to the home content by default;
//#endregion

// ? Retrieves the current year for the footer. Helps me not replace the copyright year manually
document.getElementById('footerYear').textContent = new Date().getFullYear();

//#region // ? code to enable bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
//#endregion