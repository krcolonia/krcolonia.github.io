//#region // ? Global Variables

const currentDate = new Date();
const pastDate = new Date("2002-12-20");

let yearsDifference = currentDate.getFullYear() - pastDate.getFullYear();

// ? If current month is less than birth month OR if current month is same as birthMonth, but current day is less than birthday
if (currentDate.getMonth() < pastDate.getMonth() || (currentDate.getMonth() === pastDate.getMonth() && currentDate.getDate() < pastDate.getDate())) {
  yearsDifference--;
}

// ? Tab State Variables
let currentTabs = [];
let activeTab = "Home";
let prevTab = "Home";

//#endregion

//#region // ? Sidebar Functionality
var sidebarOpen = false;

function toggleSidebar() {
	const sidebarContainer = document.getElementById('sidebarContainer');
	const sidebar = document.getElementById('sidebarNav');
	const sidebarBtnIcon = document.getElementById('sidebarBtnIcon');

	if(sidebarOpen == true) {
		// sidebarContainer.style.width = '42px';
		sidebar.style.left = '-208px';
		sidebarBtnIcon.src = 'images/sidebar-open.png';
		sidebarOpen = false;
	}
	else {
		// sidebarContainer.style.width = '250px';
		sidebar.style.left = '0px';
		sidebarBtnIcon.src = "images/sidebar-close.png";
		sidebarOpen = true;
	}
}
//#endregion

//#region // ? Text Scramble

// ? Credits to luthifbg for the JavaScript Scramble text script
// ? link to origin of Scramble text script: https://github.com/luthfibg/sebelaslvl/blob/main/js_scramble_text/scramble.js

const dev_type = [ "Programmer", "Full Stack Web Developer", "Game Developer", "Game Modder" ]
const el = document.querySelector("#devType");
const fx = new TextScramble(el);
let scrambleCounter = 0;

const next = () => {
	fx.setText(dev_type[scrambleCounter]).then(() => {
		setTimeout(next, 2500);
	});
	scrambleCounter = (scrambleCounter + 1) % dev_type.length;
};

next();
//#endregion

//#region // ? Text effect for each section of my portfolio that mimics typing
function textTypeEffect(id, text, blinkCursor, typeSpeed) {
	return new Promise((resolve) => {
    let textIndex = 0;
    let cancelled = false;

    if (!window.typingSessions) {
      window.typingSessions = {};
    }
    window.typingSessions[id] = () => (cancelled = true);

    function typeChar() {
      const blinkEl = document.getElementById(blinkCursor);
      const textEl = document.getElementById(id);

      if (cancelled || !textEl || !blinkEl) return resolve();

      if (textIndex >= text.length) {
        blinkEl.style.animationPlayState = "running";
        return resolve();
      }

      blinkEl.style.animationPlayState = "paused";
      textEl.innerHTML += text[textIndex++];
      setTimeout(typeChar, typeSpeed);
    }
    document.getElementById(blinkCursor).classList.add("blinkCursor");
    typeChar();
  });
}
//#endregion

//#region // ? In-site Tab Functionality
function addTab(tabName) {
	const tabContainer = document.getElementById('tabContainer');

	if (currentTabs.includes(tabName)) {
		setCurrentTab(tabName);
		toggleSidebar();
		return; // ? guard clause to check if the tab was already added
	}

	var tabExt = "";

	switch(tabName) {
		case "AboutMe":
			tabExt = ".java";
			break;
		case "TechStack":
			tabExt = ".py";
			break;
		case "FAQ":
			tabExt = ".json";
			break;
		case "Projects":
			tabExt = ".gd";
			break;
	}

	tabContainer.innerHTML += `
	<div class="menuTab d-flex flex-row justify-content-between align-content-center p-1" id="${tabName}Tab">
		<span class="flex-grow-1 mt-1 user-select-none" onClick="setCurrentTab('${tabName}')" onAuxClick="removeTab('${tabName}')">${tabName}${tabExt}</span>
		<button class="tabClose my-auto d-flex" onClick="removeTab('${tabName}')">
			<img src="images/close.png">
		</button>
	</div>`;
	currentTabs.push(tabName);

	setCurrentTab(tabName); // ? set the newly added tab as the currently active tab.
	toggleSidebar();
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
function clearTabContent(headers) {
	headers.forEach(id => {
		document.getElementById(id).innerHTML = '';
		if(window.typingSessions?.[id]) {
			window.typingSessions[id]();
			delete window.typingSessions[id];
		}
	})
}

let currentTypingSession = null;
async function setBodyContent(tabName) {
	const body = document.getElementById("mainBody");

	[...body.children]
  .forEach(child => child.id !== `${tabName}Content` ? child.style.display = 'none' : null);
	document.getElementById(`${tabName}Content`).style.display = 'block';

	// clearTabContent();
	switch(tabName) {
		case "Home":
			clearTabContent(['homeHeader'])
			setTimeout(textTypeEffect, 80, 'homeHeader','<krColonia>', 'homeCursor', 150)
			break;
		case "AboutMe":
			async function aboutMeContent() {
				const sessionId = Symbol("typingSession");
				currentTypingSession = sessionId;

				const safeType = async (...args) => {
					if(currentTypingSession !== sessionId) return;
					await textTypeEffect(...args);
				}

				if(document.getElementById('nameDelimit').innerHTML.trim() == '') {
					clearTabContent(['nameKeyword', 'nameVar', 'nameEqual', 'nameString', 'nameDelimit']);
					await safeType('nameKeyword', 'String ', 'aboutCursor', 45); 
					await safeType('nameVar', 'name ', 'aboutCursor', 45); 
					await safeType('nameEqual', '= ', 'aboutCursor', 45); 
					await safeType('nameString', '"Kurt Robin Colonia"', 'aboutCursor', 45); 
					await safeType('nameDelimit', 
`;
		`,
					'aboutCursor', 45);
				}
				

				if(document.getElementById('ageDelimit').innerHTML.trim() == '') {
					clearTabContent(['ageKeyword', 'ageVar', 'ageEqual', 'ageInt', 'ageDelimit']);
					await safeType('ageKeyword', 'int ', 'aboutCursor', 45); 
					await safeType('ageVar', 'age ', 'aboutCursor', 45); 
					await safeType('ageEqual', '= ', 'aboutCursor', 45); 
					await safeType('ageInt', yearsDifference.toString(), 'aboutCursor', 45); 
					await safeType('ageDelimit', 
`;

`, 
					'aboutCursor', 45); 
				}

				if(document.getElementById('aboutText').innerHTML.trim() == '') {
					clearTabContent(['aboutText'])
					await safeType('aboutText',
`		// ? I'm an Information Technology graduate from New Era University's Main Campus.
		// ? I have a passion for programming, seeing every bug not as a hurdle, but an exciting challenge to take on.
		// ? I like playing video games and making mods/addons, which is one of the reason why I started being interested in programming`,
					'aboutCursor', 45);
				}
			}
			await aboutMeContent();
			break;
		case "TechStack":
			break;
		case "FAQ":
			break;
		case "Projects":
			break;
		case "Contact":
			setTimeout(textTypeEffect, 80, 'contactHeader','Console.WriteLine("Let\'s Connect!");', 'contactCursor', 65)
			break;
		default:
			console.log('dude you like, broke the code. that\'s so wizard lol');
	}
}

setBodyContent("Home"); // ? sets the body content to the home content by default;
//#endregion

// ? Retrieves the current year for the footer. Helps me not replace the copyright year manually
document.getElementById('footerYear').textContent = new Date().getFullYear();

//#region // ? code to enable bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
//#endregion

