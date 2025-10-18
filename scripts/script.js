/* 
? draggable window code borrowed from w3schools with some slight modifications
? https://www.w3schools.com/howto/howto_js_draggable.asp
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
class DraggableWindow {
	constructor(title, content) {
		this.id = `window-${Date.now()}-${Math.random()}`
		this.element = this.createWindow(title, content)
		this.makeDraggable()
	}

	createWindow(title, content) {
		const window = document.createElement('div');
		window.id = this.id
		window.className = 'desktop-window'
		window.innerHTML = `
			<div class="desktop-window-header">${title}</div>
			<div class="window-content">${content}</div>
		`
		document.body.appendChild(window)
		return window
	}

	makeDraggable() {
		const header = this.element.querySelector('.desktop-window-header')
		let isDragging = false
		let currentX, currentY, initialX, initialY

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
				const viewportHeight = window.innerHeight

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

document.getElementById('recycle-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		console.log('recycle')
		new DraggableWindow('Recycle Bin', `<p>content</p>`);
	})
});

document.getElementById('about-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		console.log('about')
		new DraggableWindow('About Me', `<p>content</p>`);
	})
});

document.getElementById('project-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		console.log('project')
		new DraggableWindow('My Projects', `<p>content</p>`);
	})
});

document.getElementById('contact-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		console.log('contact')
		new DraggableWindow('Contact Me', `<p>content</p>`);
	})
});

document.getElementById('resume-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		console.log('resume')
		new DraggableWindow('My Resume', `<p>content</p>`);
	})
});
//#endregion

function dragWindow(element) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	var windowHeader = document.getElementById(element.id + '-header');
	if(windowHeader) {
		windowHeader.onmousedown = dragMouseDown;
	}
	else {
		element.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// ? get the mouse cursor position at startup
		pos3 = e.clientX;
		pos4 = e.clientY;

		document.onmouseup = closeDragElement;
		// ? call a function whenever the cursor moves
		document.onmousemove = elementDrag
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// ? calculate the new cursor position;
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position
		element.style.top = (element.offsetTop - pos2) + "px";
		element.style.left = (element.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		// ? stop moving when mouse button is released
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

// dragWindow(document.getElementById("desktop-window"));

//#region
async function loadingScreen() {
	const loadingElement = document.getElementById('loading-screen');
	const loadingIcon = document.getElementById('loading-icon');
	const loadingText = document.getElementById('loading-text')

	await new Promise(resolve => setTimeout(resolve, 5500))

	loadingIcon.classList.add('d-none');
	loadingText.innerText = "Welcome to my Web Portfolio!"

	await new Promise(resolve => setTimeout(resolve, 1000))

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