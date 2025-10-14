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
		console.log(id);
		const el = document.getElementById(id);
		if(el) {
			el.innerHTML = '';
			if(window.typingSessions?.[id]) {
				window.typingSessions[id]();
				delete window.typingSessions[id];
			}
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

	let typeSpeed; // ? The lower the typeSpeed value, the faster the type effect goes

	switch(tabName) {
		case "Home":
			clearTabContent(['homeHeader']);
			setTimeout(textTypeEffect, 80, 'homeHeader','<krColonia>', 'homeCursor', 150)
			break;
		case "AboutMe":
			typeSpeed = 20;
			async function aboutMeContent() {
				const sessionId = Symbol("typingSession");
				currentTypingSession = sessionId;

				const safeType = async (...args) => {
					if(currentTypingSession !== sessionId) return;
					await textTypeEffect(...args);
				}

				const codeInsert = document.getElementById('aboutMainFunc');

				if(!document.getElementById('nameDelimit')) {
					codeInsert.innerHTML += `<span class="code-keyword" id="nameKeyword"></span><span class="code-variable" id="nameVar"></span><span id="nameEqual"></span><span class="code-string" id="nameString"></span><span id="nameDelimit"></span>`;
				}

				if(document.getElementById('nameDelimit').innerHTML.trim() == '') {
					clearTabContent([
						'nameKeyword',
						'nameVar',
						'nameEqual',
						'nameString',
						'nameDelimit'
					]);
					await safeType('nameKeyword', 'String ', 'aboutCursor', typeSpeed); 
					await safeType('nameVar', 'name ', 'aboutCursor', typeSpeed); 
					await safeType('nameEqual', '= ', 'aboutCursor', typeSpeed); 
					await safeType('nameString', '"Kurt Robin Colonia"', 'aboutCursor', typeSpeed); 
					await safeType('nameDelimit', 
`;
		`,
					'aboutCursor', typeSpeed);
				}
				

				if(!document.getElementById('ageDelimit')) {
					codeInsert.innerHTML += `<span class="code-keyword" id="ageKeyword"></span><span class="code-variable" id="ageVar"></span><span id="ageEqual"></span><span class="code-integer" id="ageInt"></span><span id="ageDelimit"></span>`;
				}

				if(document.getElementById('ageDelimit').innerHTML.trim() == '') {
					clearTabContent([
						'ageKeyword',
						'ageVar',
						'ageEqual',
						'ageInt',
						'ageDelimit'
					]);
					await safeType('ageKeyword', 'int ', 'aboutCursor', typeSpeed); 
					await safeType('ageVar', 'age ', 'aboutCursor', typeSpeed); 
					await safeType('ageEqual', '= ', 'aboutCursor', typeSpeed); 
					await safeType('ageInt', yearsDifference.toString(), 'aboutCursor', typeSpeed); 
					await safeType('ageDelimit', 
`;

`, 
					'aboutCursor', typeSpeed); 
				}

				if(!document.getElementById('aboutDelimiter')) {
					codeInsert.innerHTML += `<span class="comment-question" id="aboutText"></span><span class="comment-question" id="aboutDelimiter"></span>`;
				}

				if(document.getElementById('aboutDelimiter').innerHTML.trim() == '') {
					clearTabContent(['aboutText', 'aboutDelimiter'])
					await safeType('aboutText',
`		// ? I'm a Software Developer based in Quezon City, Philippines.
		// ? My interest in programming started with game development in Unity.
		// ? I've made and worked on Web and Mobile Apps, both Frontend and Backend,
		// ? During my free time, I play video games and make mods for them,
		// ? And also update my portfolio site (this one!) from time to time`,
					'aboutCursor', typeSpeed);
					await safeType('aboutDelimiter', `.
		
		`, 'aboutCursor', typeSpeed);
				}

				if(!document.getElementById('tsDelimiter')) {
					var techStack = `<span class="comment-question" id="tsSofDevSection"></span>`;
					techStack += `<span class="code-string" id="tsJava"></span><span id="tsJavaComma"></span>`;
					techStack += `<span class="code-string" id="tsKotlin"></span><span id="tsKotlinComma"></span>`;
					techStack += `<span class="code-string" id="tsCSharp"></span><span id="tsCSharpComma"></span>`;
					techStack += `<span class="comment-question" id="tsWebDevSection"></span>`;
					techStack += `<span class="code-string" id="tsHtml"></span><span id="tsHtmlComma"></span>`;
					techStack += `<span class="code-string" id="tsCss"></span><span id="tsCssComma"></span>`;
					techStack += `<span class="code-string" id="tsJs"></span><span id="tsJsComma"></span>`;
					techStack += `<span class="code-string" id="tsTs"></span><span id="tsTsComma"></span>`;
					techStack += `<span class="code-string" id="tsPhp"></span><span id="tsPhpComma"></span>`;
					techStack += `<span class="comment-question" id="tsDatabaseSection"></span>`;
					techStack += `<span class="code-string" id="tsMySql"></span><span id="tsMySqlComma"></span>`;
					techStack += `<span class="code-string" id="tsPostgres"></span><span id="tsPostgresComma"></span>`;
					techStack += `<span class="code-string" id="tsFirebase"></span><span id="tsFirebaseComma"></span>`;
					techStack += `<span class="comment-question" id="tsFrameworkToolSection"></span>`;
					techStack += `<span class="code-string" id="tsComposer"></span><span id="tsComposerComma"></span>`;
					techStack += `<span class="code-string" id="tsLaravel"></span><span id="tsLaravelComma"></span>`;
					techStack += `<span class="code-string" id="tsNodeJs"></span><span id="tsNodeJsComma"></span>`;
					techStack += `<span class="code-string" id="tsReactJs"></span><span id="tsReactJsComma"></span>`;
					techStack += `<span class="code-string" id="tsReactTs"></span><span id="tsReactTsComma"></span>`;
					techStack += `<span class="code-string" id="tsBootstrap"></span><span id="tsBootstrapComma"></span>`;
					
					// * the end is never the end is never the end is never the end is never the end -> this line probably.
					codeInsert.innerHTML += '<span class="code-keyword" id="tsKeyword"></span><span id="tsKeyArr"></span><span class="code-variable" id="tsVar"></span><span id="tsEqual"></span><span id="tsOpenBracket"></span>'+ techStack +'<span id="tsCloseBracket"></span><span id="tsDelimiter"></span>';
					console.log(codeInsert.innerHTML)
				}

				if(document.getElementById('tsDelimiter').innerHTML.trim() == '') {
					clearTabContent([
						'tsKeyword',
						'tsKeyArr',
						'tsVar',
						'tsEqual',
						'tsOpenBracket',
							'tsSofDevSection',
								'tsJava', 'tsJavaComma',
								'tsKotlin', 'tsKotlinComma',
								'tsCSharp', 'tsCSharpComma',
							'tsWebDevSection',
								'tsHtml', 'tsHtmlComma',
								'tsCss', 'tsCssComma',
								'tsJs', 'tsJsComma',
								'tsTs', 'tsTsComma',
								'tsPhp', 'tsPhpComma',
							'tsDatabaseSection',
								'tsMySql', 'tsMySqlComma',
								'tsPostgres', 'tsPostgresComma',
								'tsFirebase', 'tsFirebaseComma',
							'tsFrameworkToolSection',
								'tsComposer', 'tsComposerComma',
								'tsLaravel', 'tsLaravelComma',
								'tsNodeJs', 'tsNodeJsComma',
								'tsReactJs', 'tsReactJsComma',
								'tsReactTs', 'tsReactTsComma',
								'tsBootstrap', 'tsBootstrapComma',
						'tsCloseBracket',
						'tsDelimiter'
					]);
					await safeType('tsKeyword', 'String', 'aboutCursor', typeSpeed);
					await safeType('tsKeyArr', '[] ', 'aboutCursor', typeSpeed);
					await safeType('tsVar', 'myStack ', 'aboutCursor', typeSpeed);
					await safeType('tsEqual', '= ', 'aboutCursor', typeSpeed);
					await safeType('tsOpenBracket', '{', 'aboutCursor', typeSpeed);
					
					await safeType('tsSofDevSection', `
			// ? Software Development
			`, 'aboutCursor', typeSpeed);
					await safeType('tsJava', `"Java"`, 'aboutCursor', typeSpeed); await safeType('tsJavaComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsKotlin', `"Kotlin"`, 'aboutCursor', typeSpeed); await safeType('tsKotlinComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsCSharp', `"C#"`, 'aboutCursor', typeSpeed); await safeType('tsCSharpComma', `,
			`, 'aboutCursor', typeSpeed);
					
					await safeType('tsWebDevSection', `
			// ? Web Development
			`, 'aboutCursor', typeSpeed);
					await safeType('tsHtml', `"HTML"`, 'aboutCursor', typeSpeed); await safeType('tsHtmlComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsCss', `"CSS"`, 'aboutCursor', typeSpeed); await safeType('tsCssComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsJs', `"JavaScript"`, 'aboutCursor', typeSpeed); await safeType('tsJsComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsTs', `"TypeScript"`, 'aboutCursor', typeSpeed); await safeType('tsTsComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsPhp', `"PHP"`, 'aboutCursor', typeSpeed); await safeType('tsPhpComma', `,
			`, 'aboutCursor', typeSpeed);
					
					await safeType('tsDatabaseSection', `
			// ? Database Management
			`, 'aboutCursor', typeSpeed);
					await safeType('tsMySql', `MySQL`, 'aboutCursor', typeSpeed); await safeType('tsMySqlComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsPostgres', `PostgreSQL`, 'aboutCursor', typeSpeed); await safeType('tsPostgresComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsFirebase', `Firebase`, 'aboutCursor', typeSpeed); await safeType('tsFirebaseComma', `,
			`, 'aboutCursor', typeSpeed);

					await safeType('tsFrameworkToolSection', `
			// ? Frameworks and Tools
			`, 'aboutCursor', typeSpeed);
					await safeType('tsLaravel', `"PHP Laravel"`, 'aboutCursor', typeSpeed); await safeType('tsLaravelComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsReactJs', `"React.JS"`, 'aboutCursor', typeSpeed); await safeType('tsReactJsComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsReactTs', `"React.TS"`, 'aboutCursor', typeSpeed); await safeType('tsReactTsComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsBootstrap', `"CSS Bootstrap"`, 'aboutCursor', typeSpeed); await safeType('tsBootstrapComma', `,
		`, 'aboutCursor', typeSpeed);

					await safeType('tsCloseBracket', '}', 'aboutCursor', typeSpeed);
					await safeType('tsDelimiter', ';', 'aboutCursor', typeSpeed);
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

