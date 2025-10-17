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

const dev_type = [ "Programmer", "Aspiring Full Stack Web Developer",  "Laravel Developer" ]
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
		// case "TechStack":
		// 	tabExt = ".py";
		// 	break;
		// case "FAQ":
		// 	tabExt = ".json";
		// 	break;
		case "Projects":
			tabExt = ".json";
			break;
		case "Contact":
			tabExt = ".cs";
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
		// console.log(id);
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

	let typeSpeed; // ? The lower the typeSpeed value, the faster the type effect goes

	let isTyping = false;
	// let isTyping = document.getElementById("typeAnim").checked;
	// console.log(isTyping);

	switch(tabName) {
		case "Home":
			if(!document.getElementById('homeHeader').innerHTML) {
				clearTabContent(['homeHeader']);
				setTimeout(textTypeEffect, 80, 'homeHeader','<krColonia>', 'homeCursor', 150)
			}
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
`		// ? I'm an aspiring Full Stack Developer based in Quezon City, Philippines.
		// ? I've recently graduated BS Information Technology from New Era University - Main Campus. 
		// ? I've worked on Web Apps utilizing the Laravel Framework, both Frontend and Backend.
		// ? Despite being a full stack developer, my skills are more Backend-oriented.
		// ? I have a keen attention to detail, adaptable and am a fast learner, with analytical and problem solving skills`,
					'aboutCursor', typeSpeed);
					await safeType('aboutDelimiter', `.
		
		`, 'aboutCursor', typeSpeed);
				}

				if(!document.getElementById('tsDelimiter')) {
					var techStack = `<span class="comment-question" id="tsSofDevSection"></span>`;
					techStack += `<span class="code-string" id="tsJava"></span><span id="tsJavaComma"></span>`;
					techStack += `<span class="code-string" id="tsKotlin"></span><span id="tsKotlinComma"></span>`;
					techStack += `<span class="code-string" id="tsPython"></span><span id="tsPythonComma"></span>`;
					techStack += `<span class="code-string" id="tsCSharp"></span><span id="tsCSharpComma"></span>`;
					techStack += `<span class="code-string" id="tsOop"></span><span id="tsOopComma"></span>`;
					techStack += `<span class="comment-question" id="tsWebDevSection"></span>`;
					techStack += `<span class="code-string" id="tsHtml"></span><span id="tsHtmlComma"></span>`;
					techStack += `<span class="code-string" id="tsCss"></span><span id="tsCssComma"></span>`;
					techStack += `<span class="code-string" id="tsJs"></span><span id="tsJsComma"></span>`;
					techStack += `<span class="code-string" id="tsPhp"></span><span id="tsPhpComma"></span>`;
					techStack += `<span class="code-string" id="tsRestApi"></span><span id="tsRestApiComma"></span>`;
					techStack += `<span class="comment-question" id="tsDatabaseSection"></span>`;
					techStack += `<span class="code-string" id="tsMySql"></span><span id="tsMySqlComma"></span>`;
					techStack += `<span class="code-string" id="tsPostgres"></span><span id="tsPostgresComma"></span>`;
					techStack += `<span class="code-string" id="tsFirebase"></span><span id="tsFirebaseComma"></span>`;
					techStack += `<span class="code-string" id="tsDbeaver"></span><span id="tsDbeaverComma"></span>`;
					techStack += `<span class="comment-question" id="tsFrameworkToolSection"></span>`;
					techStack += `<span class="code-string" id="tsComposer"></span><span id="tsComposerComma"></span>`;
					techStack += `<span class="code-string" id="tsLaravel"></span><span id="tsLaravelComma"></span>`;
					techStack += `<span class="code-string" id="tsNodeJs"></span><span id="tsNodeJsComma"></span>`;
					techStack += `<span class="code-string" id="tsJquery"></span><span id="tsJqueryComma"></span>`;
					techStack += `<span class="code-string" id="tsReactJs"></span><span id="tsReactJsComma"></span>`;
					techStack += `<span class="code-string" id="tsTailwind"></span><span id="tsTailwindComma"></span>`;
					techStack += `<span class="code-string" id="tsBootstrap"></span><span id="tsBootstrapComma"></span>`;
					techStack += `<span class="comment-question" id="tsOpSysSection"></span>`;
					techStack += `<span class="code-string" id="tsWindows"></span><span id="tsWindowsComma"></span>`;
					techStack += `<span class="code-string" id="tsLinux"></span><span id="tsLinuxComma"></span>`;
					techStack += `<span class="comment-question" id="tsVersionControlSection"></span>`
					techStack += `<span class="code-string" id="tsGit"></span><span id="tsGitComma"></span>`;
					techStack += `<span class="code-string" id="tsGithub"></span><span id="tsGithubComma"></span>`;

					
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
								'tsPython', 'tsPythonComma',
								'tsCSharp', 'tsCSharpComma',
								'tsOop', 'tsOopComma',
							'tsWebDevSection',
								'tsHtml', 'tsHtmlComma',
								'tsCss', 'tsCssComma',
								'tsJs', 'tsJsComma',
								'tsPhp', 'tsPhpComma',
								'tsRestApi', 'tsRestApiComma',
							'tsDatabaseSection',
								'tsMySql', 'tsMySqlComma',
								'tsPostgres', 'tsPostgresComma',
								'tsFirebase', 'tsFirebaseComma',
								'tsDbeaver', 'tsDbeaverComma',
							'tsFrameworkToolSection',
								'tsComposer', 'tsComposerComma',
								'tsLaravel', 'tsLaravelComma',
								'tsNodeJs', 'tsNodeJsComma',
								'tsJquery', 'tsJqueryComma',
								'tsReactJs', 'tsReactJsComma',
								'tsTailwind', 'tsTailwindComma',
								'tsBootstrap', 'tsBootstrapComma',
							'tsOpSysSection',
								'tsWindows', 'tsWindowsComma',
								'tsLinux', 'tsLinuxComma',
							'tsVersionControlSection',
								'tsGit', 'tsGitComma',
								'tsGithub', 'tsGithubComma',
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
					await safeType('tsPython', `"Python"`, 'aboutCursor', typeSpeed); await safeType('tsPythonComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsCSharp', `"C#"`, 'aboutCursor', typeSpeed); await safeType('tsCSharpComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsOop', `"Object-Oriented Programming"`, 'aboutCursor', typeSpeed); await safeType('tsOopComma', `,
			`, 'aboutCursor', typeSpeed);
					
					await safeType('tsWebDevSection', `
			// ? Web Development
			`, 'aboutCursor', typeSpeed);
					await safeType('tsHtml', `"HTML"`, 'aboutCursor', typeSpeed); await safeType('tsHtmlComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsCss', `"CSS"`, 'aboutCursor', typeSpeed); await safeType('tsCssComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsJs', `"JavaScript"`, 'aboutCursor', typeSpeed); await safeType('tsJsComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsPhp', `"PHP"`, 'aboutCursor', typeSpeed); await safeType('tsPhpComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsRestApi', `"Rest APIs and HTTP Methods"`, 'aboutCursor', typeSpeed); await safeType('tsRestApiComma', `,
			`, 'aboutCursor', typeSpeed);
					
					await safeType('tsDatabaseSection', `
			// ? Database Management
			`, 'aboutCursor', typeSpeed);
					await safeType('tsMySql', `"MySQL"`, 'aboutCursor', typeSpeed); await safeType('tsMySqlComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsPostgres', `"PostgreSQL"`, 'aboutCursor', typeSpeed); await safeType('tsPostgresComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsFirebase', `"Firebase"`, 'aboutCursor', typeSpeed); await safeType('tsFirebaseComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsDbeaver', `"DBeaver"`, 'aboutCursor', typeSpeed); await safeType('tsDbeaverComma', `,
			`, 'aboutCursor', typeSpeed);

					await safeType('tsFrameworkToolSection', `
			// ? Frameworks
			`, 'aboutCursor', typeSpeed);
					await safeType('tsLaravel', `"PHP Laravel"`, 'aboutCursor', typeSpeed); await safeType('tsLaravelComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsNodeJs', `"Node.JS"`, 'aboutCursor', typeSpeed); await safeType('tsNodeJsComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsJquery', `"jQuery and AJAX"`, 'aboutCursor', typeSpeed); await safeType('tsJqueryComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsReactJs', `"React.JS"`, 'aboutCursor', typeSpeed); await safeType('tsReactJsComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsTailwind', `"Tailwind CSS"`, 'aboutCursor', typeSpeed); await safeType('tsTailwindComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsBootstrap', `"CSS Bootstrap"`, 'aboutCursor', typeSpeed); await safeType('tsBootstrapComma', `,
		`, 'aboutCursor', typeSpeed);

					await safeType('tsOpSysSection', `
			// ? Operating Systems
			`, 'aboutCursor', typeSpeed);
					await safeType('tsWindows', `"Windows 10"`, 'aboutCursor', typeSpeed); await safeType('tsWindowsComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsLinux', `"Linux (Debian WSL and Kali Linux)"`, 'aboutCursor', typeSpeed); await safeType('tsLinuxComma', `,
		`, 'aboutCursor', typeSpeed);

					await safeType('tsVersionControlSection', `
			// ? Version Control
			`, 'aboutCursor', typeSpeed);
					await safeType('tsGit', `"Git (Git Bash)"`, 'aboutCursor', typeSpeed); await safeType('tsGitComma', `, `, 'aboutCursor', typeSpeed);
					await safeType('tsGithub', `"Github"`, 'aboutCursor', typeSpeed); await safeType('tsGithubComma', `,
	`, 'aboutCursor', typeSpeed);

					await safeType('tsCloseBracket', '}', 'aboutCursor', typeSpeed);
					await safeType('tsDelimiter', ';', 'aboutCursor', typeSpeed);
				}
			}

			function aboutMeContentNoAnim() {
				console.log('dont type this just print');

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
					document.getElementById('nameKeyword').innerHTML = 'String ';
					document.getElementById('nameVar').innerHTML = 'name ';
					document.getElementById('nameEqual').innerHTML = '= ';
					document.getElementById('nameString').innerHTML = '"Kurt Robin Colonia" ';
					document.getElementById('nameDelimit').innerHTML = 
`; 
		`;
					
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
					document.getElementById('ageKeyword').innerHTML = 'int ';
					document.getElementById('ageVar').innerHTML = 'age ';
					document.getElementById('ageEqual').innerHTML = '= ';
					document.getElementById('ageInt').innerHTML = yearsDifference.toString();
					document.getElementById('ageDelimit').innerHTML = 
`;

`;
				}

				if(!document.getElementById('aboutDelimiter')) {
					codeInsert.innerHTML += `<span class="comment-question" id="aboutText"></span><span class="comment-question" id="aboutDelimiter"></span>`;
				}

				if(document.getElementById('aboutDelimiter').innerHTML.trim() == '') {
					clearTabContent(['aboutText', 'aboutDelimiter'])
					document.getElementById('aboutText').innerHTML = 
`		// ? I'm an aspiring Full Stack Developer based in Quezon City, Philippines.
		// ? I've recently graduated BS Information Technology from New Era University - Main Campus. 
		// ? I've worked on Web Apps utilizing the Laravel Framework, both Frontend and Backend.
		// ? Despite being a full stack developer, my skills are more Backend-oriented.
		// ? I have a keen attention to detail, adaptable and am a fast learner, with analytical and problem solving skills`;
					document.getElementById('aboutDelimiter').innerHTML =
`.
		
		`;
				}

				if(!document.getElementById('tsDelimiter')) {
					var techStack = `<span class="comment-question" id="tsSofDevSection"></span>`;
					techStack += `<span class="code-string" id="tsJava"></span><span id="tsJavaComma"></span>`;
					techStack += `<span class="code-string" id="tsKotlin"></span><span id="tsKotlinComma"></span>`;
					techStack += `<span class="code-string" id="tsPython"></span><span id="tsPythonComma"></span>`;
					techStack += `<span class="code-string" id="tsCSharp"></span><span id="tsCSharpComma"></span>`;
					techStack += `<span class="code-string" id="tsOop"></span><span id="tsOopComma"></span>`;
					techStack += `<span class="comment-question" id="tsWebDevSection"></span>`;
					techStack += `<span class="code-string" id="tsHtml"></span><span id="tsHtmlComma"></span>`;
					techStack += `<span class="code-string" id="tsCss"></span><span id="tsCssComma"></span>`;
					techStack += `<span class="code-string" id="tsJs"></span><span id="tsJsComma"></span>`;
					techStack += `<span class="code-string" id="tsPhp"></span><span id="tsPhpComma"></span>`;
					techStack += `<span class="code-string" id="tsRestApi"></span><span id="tsRestApiComma"></span>`;
					techStack += `<span class="comment-question" id="tsDatabaseSection"></span>`;
					techStack += `<span class="code-string" id="tsMySql"></span><span id="tsMySqlComma"></span>`;
					techStack += `<span class="code-string" id="tsPostgres"></span><span id="tsPostgresComma"></span>`;
					techStack += `<span class="code-string" id="tsFirebase"></span><span id="tsFirebaseComma"></span>`;
					techStack += `<span class="code-string" id="tsDbeaver"></span><span id="tsDbeaverComma"></span>`;
					techStack += `<span class="comment-question" id="tsFrameworkToolSection"></span>`;
					techStack += `<span class="code-string" id="tsComposer"></span><span id="tsComposerComma"></span>`;
					techStack += `<span class="code-string" id="tsLaravel"></span><span id="tsLaravelComma"></span>`;
					techStack += `<span class="code-string" id="tsNodeJs"></span><span id="tsNodeJsComma"></span>`;
					techStack += `<span class="code-string" id="tsJquery"></span><span id="tsJqueryComma"></span>`;
					techStack += `<span class="code-string" id="tsReactJs"></span><span id="tsReactJsComma"></span>`;
					techStack += `<span class="code-string" id="tsTailwind"></span><span id="tsTailwindComma"></span>`;
					techStack += `<span class="code-string" id="tsBootstrap"></span><span id="tsBootstrapComma"></span>`;
					techStack += `<span class="comment-question" id="tsOpSysSection"></span>`;
					techStack += `<span class="code-string" id="tsWindows"></span><span id="tsWindowsComma"></span>`;
					techStack += `<span class="code-string" id="tsLinux"></span><span id="tsLinuxComma"></span>`;
					techStack += `<span class="comment-question" id="tsVersionControlSection"></span>`
					techStack += `<span class="code-string" id="tsGit"></span><span id="tsGitComma"></span>`;
					techStack += `<span class="code-string" id="tsGithub"></span><span id="tsGithubComma"></span>`;

					
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
								'tsPython', 'tsPythonComma',
								'tsCSharp', 'tsCSharpComma',
								'tsOop', 'tsOopComma',
							'tsWebDevSection',
								'tsHtml', 'tsHtmlComma',
								'tsCss', 'tsCssComma',
								'tsJs', 'tsJsComma',
								'tsPhp', 'tsPhpComma',
								'tsRestApi', 'tsRestApiComma',
							'tsDatabaseSection',
								'tsMySql', 'tsMySqlComma',
								'tsPostgres', 'tsPostgresComma',
								'tsFirebase', 'tsFirebaseComma',
								'tsDbeaver', 'tsDbeaverComma',
							'tsFrameworkToolSection',
								'tsComposer', 'tsComposerComma',
								'tsLaravel', 'tsLaravelComma',
								'tsNodeJs', 'tsNodeJsComma',
								'tsJquery', 'tsJqueryComma',
								'tsReactJs', 'tsReactJsComma',
								'tsTailwind', 'tsTailwindComma',
								'tsBootstrap', 'tsBootstrapComma',
							'tsOpSysSection',
								'tsWindows', 'tsWindowsComma',
								'tsLinux', 'tsLinuxComma',
							'tsVersionControlSection',
								'tsGit', 'tsGitComma',
								'tsGithub', 'tsGithubComma',
						'tsCloseBracket',
						'tsDelimiter'
					]);
					document.getElementById('tsKeyword').innerHTML = 'String';
					document.getElementById('tsKeyArr').innerHTML = '[] ';
					document.getElementById('tsVar').innerHTML = 'myStack ';
					document.getElementById('tsEqual').innerHTML = '= ';
					document.getElementById('tsOpenBracket').innerHTML = '{';

					document.getElementById('tsSofDevSection').innerHTML = `
			// ? Software Development
			`;
					document.getElementById('tsJava').innerHTML = `"Java"`; document.getElementById('tsJavaComma').innerHTML = `, `;
					document.getElementById('tsKotlin').innerHTML = `"Kotlin"`; document.getElementById('tsKotlinComma').innerHTML = `, `;
					document.getElementById('tsPython').innerHTML = `"Python"`; document.getElementById('tsPythonComma').innerHTML = `, `;
					document.getElementById('tsCSharp').innerHTML = `"C#"`; document.getElementById('tsCSharpComma').innerHTML = `, `;
					document.getElementById('tsOop').innerHTML = `"Object-Oriented Programming"`; document.getElementById('tsOopComma').innerHTML = `, 
			`;

					document.getElementById('tsWebDevSection').innerHTML = `
			// ? Web Development
			`;
					document.getElementById('tsHtml').innerHTML = `"HTML"`; document.getElementById('tsHtmlComma').innerHTML = `, `;
					document.getElementById('tsCss').innerHTML = `"CSS"`; document.getElementById('tsCssComma').innerHTML = `, `;
					document.getElementById('tsJs').innerHTML = `"JavaScript"`; document.getElementById('tsJsComma').innerHTML = `, `;
					document.getElementById('tsPhp').innerHTML = `"PHP"`; document.getElementById('tsPhpComma').innerHTML = `, `;
					document.getElementById('tsRestApi').innerHTML = `"Rest APIs and HTTP Methods"`; document.getElementById('tsRestApiComma').innerHTML = `, 
			`;
					
					document.getElementById('tsDatabaseSection').innerHTML = `
			// ? Database Management
			`;
					document.getElementById('tsMySql').innerHTML = `"MySQL"`; document.getElementById('tsMySqlComma').innerHTML = `, `;
					document.getElementById('tsPostgres').innerHTML = `"PostgreSQL"`; document.getElementById('tsPostgresComma').innerHTML = `, `;
					document.getElementById('tsFirebase').innerHTML = `"Firebase"`; document.getElementById('tsFirebaseComma').innerHTML = `, `;
					document.getElementById('tsDbeaver').innerHTML = `"DBeaver"`; document.getElementById('tsDbeaverComma').innerHTML = `, 
			`;
					
					document.getElementById('tsFrameworkToolSection').innerHTML = `
			// ? Frameworks
			`;
					document.getElementById('tsLaravel').innerHTML = `"PHP Laravel"`; document.getElementById('tsLaravelComma').innerHTML = `, `;
					document.getElementById('tsNodeJs').innerHTML = `"Node.JS"`; document.getElementById('tsNodeJsComma').innerHTML = `, `;
					document.getElementById('tsJquery').innerHTML = `"jQuery and AJAX"`; document.getElementById('tsJqueryComma').innerHTML = `, `;
					document.getElementById('tsReactJs').innerHTML = `"React.JS"`; document.getElementById('tsReactJsComma').innerHTML = `, `;
					document.getElementById('tsTailwind').innerHTML = `"Tailwind CSS"`; document.getElementById('tsTailwindComma').innerHTML = `, `;
					document.getElementById('tsBootstrap').innerHTML = `"CSS Bootstrap"`; document.getElementById('tsBootstrapComma').innerHTML = `, 
			`;

					document.getElementById('tsOpSysSection').innerHTML = `
			// ? Operating Systems
			`;
					document.getElementById('tsWindows').innerHTML = `"Windows 10"`; document.getElementById('tsWindowsComma').innerHTML = `, `;
					document.getElementById('tsLinux').innerHTML = `"Linux (Debian WSL and Kali Linux)"`; document.getElementById('tsLinuxComma').innerHTML = `, 
			`;

					document.getElementById('tsVersionControlSection').innerHTML = `
			// ? Version Control
			`;
					document.getElementById('tsGit').innerHTML = `"Git (Git Bash)"`; document.getElementById('tsGitComma').innerHTML = `, `;
					document.getElementById('tsGithub').innerHTML = `"Github"`; document.getElementById('tsGithubComma').innerHTML = `, 
		`;

					document.getElementById('tsCloseBracket').innerHTML = '}';
					document.getElementById('tsDelimiter').innerHTML = ';';
				}
			}

			if(isTyping) await aboutMeContent();
			else aboutMeContentNoAnim();

			break;
		// case "FAQ":
		// 	break;
		case "Projects":
			break;
		case "Contact":
			if(!document.getElementById('contactHeader').innerHTML) {
				clearTabContent(['contactHeader']);
				setTimeout(textTypeEffect, 80, 'contactHeader','Console.WriteLine("Let\'s Connect!");', 'contactCursor', 65)
			}
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

