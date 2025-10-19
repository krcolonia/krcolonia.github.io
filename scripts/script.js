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

	constructor(icon, title, content, width, height) {
		this.id = `window-${Date.now()}-${Math.random()}`
		this.element = this.createWindow(icon, title, content, width, height)
		this.makeDraggable()
	}

	createWindow(icon, title, content, width, height) {
		const windowElement = document.createElement('div');
		windowElement.id = this.id
		windowElement.className = 'desktop-window'
		windowElement.style.width = width + '%';
		windowElement.style.height = height + '%';
		windowElement.style.zIndex = ++DraggableWindow.highestZ;
		windowElement.innerHTML = `
			<div class="desktop-window-header p-0">
				<div class="p-2 d-flex gap-2 justify-content-start align-items-center">
						<img src="./images/desktop-icons/${icon}.png" class="desktop-window-icon h-100"/><span>${title}</span>
				</div>
				<div class="p-2 d-flex justify-content-end align-items-center">
					<button class="d-flex p-1 border-0 bg-transparent close-window h-100">
						<img src="./images/close.png" class="h-100">
					</button>
				</div>
			</div>
			<div class="desktop-window-content flex-grow-1">${content}</div>
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
// ? Icon Selection script
let selectedIcon = null;
let clickTimer = null;

function handleIconClick(iconElement, actionCallback) {
	clearTimeout(clickTimer);

	if(selectedIcon === iconElement) {
		actionCallback();
		selectedIcon = null;
		iconElement.classList.remove('desktop-app-selected');
	}
	else {
		if(selectedIcon) {
			selectedIcon.classList.remove('desktop-app-selected');
		}
		selectedIcon = iconElement;
		iconElement.classList.add('desktop-app-selected');

		clickTimer = setTimeout(() => {
			if(selectedIcon === iconElement) {
				iconElement.classList.remove('desktop-app-selected');
				selectedIcon = null;
			}
		}, 3000);
	}
}

const guideContent = `
<div class="h-100 w-100 px-3 py-2">
	<h3 align="center">Welcome to Kurt Colonia's Portfolio!</h3>
	<p class="m-0 p-0 h-100 w-100">Welcome to my portfolio!</p>
</div>
`;
const guideWidth = '70';
const guideHeight = '65';

// new DraggableWindow(
// 	'guide',
// 	'User Guide',
// 	guideContent,
// 	guideWidth,
// 	guideHeight
// );

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
	handleIconClick(this, () => {
		
	})
});

// document.getElementById('recycle-icon').addEventListener('click', function() {
// 	handleIconClick(this, () => {
// 		if(!activeWindows.includes('Recycle Bin')) {
// 			new DraggableWindow(
// 				'trash', 
// 				'Recycle Bin', 
// 				`<p class="m-0 p-0 h-100 w-100">content</p>`,
// 				'45',
// 			);
// 		}
// 	})
// });

document.getElementById('about-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		if(!activeWindows.includes('About Me')) {
			new DraggableWindow(
				'scrapbook', 
				'About Me', 
				`<p class="m-0 p-0 h-100 w-100">content</p>`,
				'45',
			);
		}
	})
});

document.getElementById('project-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		if(!activeWindows.includes('My Projects')) {
			new DraggableWindow(
				'projects', 
				'My Projects', 
				`<p class="m-0 p-0 h-100 w-100">content</p>`,
				'45',
			);
		}
	})
});

document.getElementById('contact-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		if(!activeWindows.includes('Contact Me')) {
			new DraggableWindow(
				'contact', 
				'Contact Me', 
				`<p class="m-0 p-0 h-100 w-100">content</p>`,
				'45',
			);
		}
	})
});

document.getElementById('resume-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		if(!activeWindows.includes('My Resume')) {
			new DraggableWindow(
				'file', 
				'My Resume', 
				`
				<embed src="./objects/Colonia_Resume.pdf" class="w-100 h-100 p-1" style="border-radius: 8px;">
				`,
				'50',
				'85'
			);
		}
	})
});

document.getElementById('linkedin-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		window.open(
			'https://www.linkedin.com/in/krcolonia/', 
			'_blank'
		);
	})
})

document.getElementById('github-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		window.open(
			'https://github.com/krcolonia', 
			'_blank'
		);
	})
})

document.getElementById('gmail-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		window.open(
			'mailto:krcolonia@gmail.com', 
			'_blank'
		);
	})
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

// TODO -> i might actually steal (borrow) some code from w3schools again lmao. I love programming https://www.w3schools.com/html/html5_draganddrop.asp