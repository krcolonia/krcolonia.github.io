/* 
? draggable window code borrowed from w3schools with some slight modifications
? https://www.w3schools.com/howto/howto_js_draggable.asp

? my portfolio site also takes huge inspiration from Shar Yap's portfolio
? check it here: https://www.sharyap.com/
*/

// TODO -> make the function flexible towards multiple windows in the case that I add in all the other content

//#region
// ? Mouse Click Sounds
var canClick = false;
const leftClickSound = new Audio('../sounds/mouseleft.ogg')
const rightClickSound = new Audio('../sounds/mouseright.ogg')

document.addEventListener('click', () => {
	if(canClick) {
		leftClickSound.currentTime = 0;
		leftClickSound.play();
	}
})

document.addEventListener('contextmenu', () => {
	if(canClick) {
		rightClickSound.currentTime = 0;
		rightClickSound.play();
	}
});
//#endregion

//#region
// ? Draggable Window code

let activeWindows = [];

class DraggableWindow {
	static highestZ = 1000;

	constructor(icon, title, content, width, height, scrollable = false) {
		this.id = `window-${Date.now()}-${Math.random()}`
		this.element = this.createWindow(icon, title, content, width, height, scrollable)
		this.makeDraggable()
	}

	createWindow(icon, title, content, width, height, scrollable = false) {

		let scrollStyle = '';
		if (scrollable) {
			scrollStyle = ' overflow-y-auto';
		}

		const windowElement = document.createElement('div');
		windowElement.id = this.id
		windowElement.className = 'desktop-window'
		windowElement.style.width = width + 'vw';
		windowElement.style.height = height + 'vh';
		windowElement.style.opacity = 0;
		windowElement.style.zIndex = ++DraggableWindow.highestZ;
		windowElement.innerHTML = `
			<div class="desktop-window-header p-0">
				<div class="p-2 d-flex gap-2 justify-content-start align-items-center">
						<img src="./images/desktop-icons/${icon}.png" class="desktop-window-icon h-100"/><span>${title}</span>
				</div>
				<div class="p-2 d-flex justify-content-end align-items-center">
					<button class="close-window d-flex border-0 bg-transparent h-100">
						<img src="./images/close.png" class="h-100">
					</button>
				</div>
			</div>
			<div class="desktop-window-content flex-grow-1 p-4 ${scrollStyle}">${content}</div>
		`

		activeWindows.push(title);
		document.body.appendChild(windowElement)

		const closeButton = windowElement.querySelector('.close-window')
		closeButton.addEventListener('click', () => {
			windowElement.remove()
			activeWindows = activeWindows.filter(item => item !== title);
		})

		const windowWidth = windowElement.offsetWidth
		const windowHeight = windowElement.offsetHeight
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight - 45

		windowElement.style.left = (viewportWidth - windowWidth) / 2 + "px"
		windowElement.style.top = (viewportHeight - windowHeight) / 2 + "px"

		void windowElement.offsetHeight

		setTimeout(() => {
			windowElement.style.opacity = 100;
		}, 50)

		return windowElement
	}

	bringToFront() {
		this.element.style.zIndex = ++DraggableWindow.highestZ
	}

	makeDraggable() {
		const header = this.element.querySelector('.desktop-window-header')
		let isDragging = false
		let currentX, currentY, initialX, initialY

		this.element.addEventListener('mousedown', () => {
			this.bringToFront();
		})

		header.addEventListener('mousedown', (e) => {
			isDragging = true;
			initialX = e.clientX - this.element.offsetLeft
			initialY = e.clientY - this.element.offsetTop

			this.element.style.zIndex = Date.now()
		})

		document.addEventListener('mousemove', (e) => {
			if(isDragging) {
				e.preventDefault()

				currentX = e.clientX - initialX
				currentY = e.clientY - initialY

				const windowWidth = this.element.offsetWidth
				const windowHeight = this.element.offsetHeight
				const viewportWidth = window.innerWidth
				const viewportHeight = window.innerHeight - 45

				currentX = Math.max(0, Math.min(currentX, viewportWidth - windowWidth))
				currentY = Math.max(0, Math.min(currentY, viewportHeight - windowHeight))

				this.element.style.left = currentX + 'px'
				this.element.style.top = currentY + 'px'
			}
		})

		document.addEventListener('mouseup', () => {
			isDragging = false;
		})
	}
}
//#endregion

//#region
// ? Desktop App Content
const guideContent = `
<h3 class="fw-bold" align="center">Welcome to Kurt Colonia's Portfolio!</h3>
<p class="m-0 p-0 h-100 w-100" style="text-indent: 25px; text-align: justify; text-justify: inter-word;">
	This is the current iteration/redesign of my web portfolio! I wanted to make my portfolio look like a desktop environment to make my portfolio a bit more unique compared to other people's portfolio.<br><br>
	If you'd like to view a more traditional style of web portfolio, <a href="./portfolio">Click here!</a>
</p>
`;
const guideWidth = '70';
const guideHeight = '65';
document.getElementById('guide-icon').addEventListener('click', function() {
	if(!activeWindows.includes('User Guide')) {
		new DraggableWindow(
			'guide',
			'User Guide',
			guideContent,
			guideWidth,
			guideHeight
		);
	}
});

document.getElementById('about-icon').addEventListener('click', function() {
	if(!activeWindows.includes('About Me')) {
		new DraggableWindow(
			'scrapbook', 
			'About Me', 
			`
			<div class="d-flex flex-row p-2 justify-content-center align-items-center gap-3" id="about-header">
				<img src="./images/PFP.png" class="rounded-circle m-0 p-0" style="width: 15%; border: 2px solid black;">
				<div class="d-flex flex-column mt-3">
					<h3 class="fw-bold">Kurt Robin Colonia</h3>
					<p>Full-Stack Web Developer</p>
				</div>
			</div>
			<div id="about-content" class="p-3 m-0">
				<p style="text-center">Hello World! I'm Kurt, a Full Stack Web Developer</p>
			</div>
			`,
			'75',
			'80',
			true
		);
	}
});

let projectContent = ``;
let projectFlex = ``;
// ? github rest api for fetching my github repos
fetch('https://api.github.com/users/krcolonia/repos')
	.then(response => response.json())
	.then(data => 
		data.forEach(item => {
			const repos = ["JRSK-Booking", "CodeBreakers", "Yummly", "GameSRC"]

			if(repos.some(repo => item.name.includes(repo))) {
				let homepage = ``;

				let uploadDate = new Date(item.created_at).toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				})

				// ? I don't like nesting if statements, but my caveman brain can't currently think of a better solution
				if(item.homepage != null) {
					if (item.homepage.length != 0) {
						homepage = `
						<a href="${item.homepage}" target="_blank" class="github-card-button p-1">View Deployed Page</a>
						`;
					}
				}

				projectContent += `
					<div class="p-3 m-0 github-card" id="${item.name}">
						<p class="text-xl fw-bold">${item.name} <span id="github-date" class="fw-normal fst-italic">Uploaded ${uploadDate}</span></p>
						<p style="text-indent: 25px; text-align: justify;">${item.description}</p>
						<div class="d-flex flex-row justify-content-between">
							<a href="${item.html_url}" target="_blank" class="github-card-button p-1">Visit Repository</a>
							${homepage}
						</div>
					</div>
				`;

				projectFlex = `
				<div class="d-flex flex-column gap-3 p-0 m-0">
				${projectContent}
				</div>
				`;
			}
		})
	)
	.catch(error => console.error('Error:', error));

document.getElementById('project-icon').addEventListener('click', function() {
	if(!activeWindows.includes('My Projects')) {
		new DraggableWindow(
			'projects', 
			'My Projects', 
			projectFlex,
			'45',
			'60',
			true
		);
	}
});

document.getElementById('contact-icon').addEventListener('click', function() {
	if(!activeWindows.includes('Contact Me')) {
		new DraggableWindow(
			'contact', 
			'Contact Me', 
			`<p class="m-0 p-0 w-100">content</p>`,
			'45',
		);
	}
});

document.getElementById('resume-icon').addEventListener('click', function() {
	if(!activeWindows.includes('My Résumé')) {
		new DraggableWindow(
			'file', 
			'My Résumé', 
			`
			<embed src="./objects/Colonia_Resume.pdf" class="w-100 h-100" style="border-radius: 8px;">
			`,
			'50',
			'85'
		);
	}
});

document.getElementById('linkedin-icon').addEventListener('click', function() {
	window.open(
		'https://www.linkedin.com/in/krcolonia/', 
		'_blank'
	);
})

document.getElementById('github-icon').addEventListener('click', function() {
	window.open(
		'https://github.com/krcolonia', 
		'_blank'
	);
})

document.getElementById('gmail-icon').addEventListener('click', function() {
	window.open(
		'mailto:krcolonia@gmail.com', 
		'_blank'
	);
})
//#endregion

//#region
async function loadingScreen() {
	const loadingElement = document.getElementById('loading-screen');
	const loadingIcon = document.getElementById('loading-icon');
	const loadingText = document.getElementById('loading-text');
	const loadingPfp = document.getElementById('loading-pfp')

	await new Promise(resolve => setTimeout(resolve, 5500))
	
	loadingPfp.classList.remove('opacity-0');
	loadingPfp.classList.add('opacity-100');

	loadingIcon.classList.remove('opacity-100');
	loadingIcon.classList.add('opacity-0');

	loadingText.innerText = "Welcome back, Kurt Colonia."

	await new Promise(resolve => setTimeout(resolve, 1500))

	loadingElement.classList.remove('opacity-100');
	loadingElement.classList.add('opacity-0');

	await new Promise(resolve => setTimeout(resolve, 1000))

	loadingElement.classList.remove('d-flex');
	loadingElement.classList.add('d-none');
	canClick = true;

	new DraggableWindow(
	'guide',
	'User Guide',
	guideContent,
	guideWidth,
	guideHeight
	);
}

loadingScreen()
//#endregion

//#region
// ? Taskbar Date and Time section
function startTime() {
	const today = new Date();
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var seconds = today.getSeconds();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12;
	minutes = minutes < 10 ? '0'+minutes : minutes;
	// seconds = seconds < 10 ? '0'+seconds: seconds;
	// document.getElementById('taskbar-clock').innerHTML = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
	document.getElementById('taskbar-clock').innerHTML = hours + ':' + minutes + ' ' + ampm;
	setTimeout(startTime, 1000);
}

startTime()
//#endregion
document.getElementById('currentYear').textContent = new Date().getFullYear();

if (window.innerWidth < 768) {
	console.log("FAH!")
	window.location.replace('./portfolio');
}

// TODO -> i might actually steal (borrow) some code from w3schools again lmao. I love programming https://www.w3schools.com/html/html5_draganddrop.asp