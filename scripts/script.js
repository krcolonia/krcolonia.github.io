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
<h3 class="fw-bold" align="center">Welcome to Kurt Colonia's Portfolio!</h3>
<p class="m-0 p-0 h-100 w-100" style="text-indent: 25px; text-align: justify; text-justify: inter-word;">This is the current iteration/redesign of my web portfolio! I wanted to make my portfolio look like a desktop environment to make my portfolio a bit more unique compared to other people's portfolio.</p>
`;
const guideWidth = '70';
const guideHeight = '65';

new DraggableWindow(
	'guide',
	'User Guide',
	guideContent,
	guideWidth,
	guideHeight
);

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
				`
				<div class="d-flex flex-row p-2 justify-content-center align-items-center gap-3" id="about-header">
					<img src="./images/PFP.png" class="rounded-circle m-0 p-0" style="width: 15%; border: 2px solid black;">
					<div class="d-flex flex-column mt-3">
						<h3 class="fw-bold">Kurt Robin Colonia</h3>
						<p>Aspiring Full-Stack Developer</p>
					</div>
				</div>
				<div>
					<div class="d-flex flex-column gap-1 w-100">
						<div class="d-flex flex-row gap-1 w-100 justify-content-center">
							<div class="d-flex flex-column">
								<div class="w-100 m-0 p-0" style="background: #512BD4;"><img src="https://img.shields.io/badge/c%23-512BD4.svg?style=for-the-badge&logo=dotnet&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #ED8B00;"><img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #8511FA;"><img src="https://img.shields.io/badge/kotlin-%238511FA.svg?style=for-the-badge&logo=kotlin&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #3670A0;"><img src="https://img.shields.io/badge/python-3670A0.svg?style=for-the-badge&logo=python&logoColor=ffdd54"></div>
								<div class="w-100 m-0 p-0" style="background: #478CBF;"><img src="https://img.shields.io/badge/gdscript-478CBF.svg?style=for-the-badge&logo=godotengine&logoColor=white"></div>
							</div>
							<div class="d-flex flex-column">
								<div class="w-100 m-0 p-0" style="background: #E34F26;"><img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #1572B6;"><img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #F7DF1E;"><img src="https://img.shields.io/badge/javascript-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black"></div>
								<div class="w-100 m-0 p-0" style="background: #3178C6;"><img src="https://img.shields.io/badge/typescript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #777BB4;"><img src="https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white"></div>
							</div>
							<div class="d-flex flex-column">
								<div class="w-100 m-0 p-0" style="background: #D00000;"><img src="https://img.shields.io/badge/laravel-%23D00000.svg?style=for-the-badge&logo=Laravel&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #61DAFB;"><img src="https://img.shields.io/badge/tailwind css-61DAFB.svg?style=for-the-badge&logo=tailwindcss&logoColor=black"></div>
								<div class="w-100 m-0 p-0" style="background: #8511FA;"><img src="https://img.shields.io/badge/bootstrap-%238511FA.svg?style=for-the-badge&logo=bootstrap&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #02569B;"><img src="https://img.shields.io/badge/vite-02569B.svg?style=for-the-badge&logo=vite&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #61DAFB;"><img src="https://img.shields.io/badge/react.js-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black"></div>
							</div>
							<div class="d-flex flex-column">
								<div class="w-100 m-0 p-0" style="background: #0098FF;"><img src="https://img.shields.io/badge/vs_code-0098FF.svg?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxwYXRoIGZpbGw9IiNGRkZGRkYiIGQ9Ik00OTMuOCw1NS4yTDM4OC41LDQuNWMtMTIuMy01LjktMjYuOC0zLjQtMzYuNCw2LjJMMTUwLjMsMTk0LjhsLTg3LjktNjYuN2MtOC4yLTYuMy0xOS43LTUuNy0yNy4yLDEuMkw3LDE1NC45CgkJYy05LjMsOC40LTkuMywyMy4xLTAuMSwzMS41TDgzLjIsMjU2TDYuOSwzMjUuNmMtOS4yLDguNC05LjIsMjMuMSwwLjEsMzEuNWwyOC4yLDI1LjdjNy43LDYuOSwxOS4xLDcuNCwyNy4yLDEuMmw4Ny45LTY2LjcKCQlsMjAxLjgsMTg0LjFjOS41LDkuNiwyNC4xLDEyLjEsMzYuMyw2LjJsMTA1LjQtNTAuN2MxMS4xLTUuMywxOC4xLTE2LjUsMTguMS0yOC44Vjg0QzUxMiw3MS43LDUwNC45LDYwLjUsNDkzLjgsNTUuMkw0OTMuOCw1NS4yegoJCSBNMzg0LjEsMzcyLjNMMjMwLjksMjU2bDE1My4yLTExNi4zVjM3Mi4zeiIvPgo8L2c+Cjwvc3ZnPgo=&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #3DDC84;"><img src="https://img.shields.io/badge/android_studio-3DDC84.svg?style=for-the-badge&logo=androidstudio&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #45352F;"><img src="https://img.shields.io/badge/dbeaver-45352F.svg?style=for-the-badge&logo=dbeaver&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #FF6C37;"><img src="https://img.shields.io/badge/postman-FF6C37.svg?style=for-the-badge&logo=postman&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #2c3e50;"><img src="https://img.shields.io/badge/mailpit-2c3e50.svg?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjQ2MCIgdmlld0JveD0iMCAwIDEzMi4yOTIgMTIxLjcwOCIgdmVyc2lvbj0iMS4xIiBpZD0ic3ZnNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcyBpZD0iZGVmczEwIi8+CiAgPHBhdGggZD0iTTEyLjMyMSAwbDUzLjg2MSA1My45MThMMTIwLjM2NSAwek01LjE1NSA5LjAyNWw2MC44NDIgNTkuNjczIDYxLjIxMS01OS40ODktLjE4NSAzNi44MzVMNjYuOTIxIDcwLjU0bDE1LjE2NCAxMi42MTYtOC4xMzcgNS45ODYtNDEuNjA5LjE4NGMtNC44MzgtLjAyMi0yNS44NzctMTguMzQtMjcuMTg1LTQxLjI1NXoiIGZpbGwtb3BhY2l0eT0iLjk0MSIgZmlsbD0iIzJkNGE1ZiIgaWQ9InBhdGgyIiBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxIi8+CiAgPHBhdGggZD0iTTc4LjM4NSA3Mi4wNDlsNTMuOTA3LTIxLjY3OS04LjAzMSA1Ny4zMTgtMTEuODQ1LTkuMTMyYy0yMS43MjcgMjMuMTcxLTQ1LjI1NSAyNi4yODktNjcuOTk3IDIwLjgzN1MxMi4yODEgOTguMzkgNS4xNTUgODMuOC0uNjcgNTMuMTE2IDIuODQzIDM4Ljc2OWMxLjEzIDEwLjUxMS0xLjMxMyAxNi4zMTYgNi4zOCAzMy42MTIgNi4zMSAxMS4zOTkgMTQuNDEzIDIwLjQxNyAyNS44OSAyNC45NTYgMTMuOSA2LjE5NSAzMi4yNDcgMy4zNTcgNDEuNzAxLTMuMDM5bDE0LjI0LTEyLjE1NnoiIGZpbGw9IiMwMGI3ODYiIGlkPSJwYXRoNCIvPgo8L3N2Zz4=&logoColor=white"></div>
							</div>
						</div>

						<div class="d-flex flex-row gap-1 w-100 justify-content-center">
							<div class="d-flex flex-column">
								<div class="w-100 m-0 p-0" style="background: #FB7A24;"><img src="https://img.shields.io/badge/xampp-FB7A24.svg?style=for-the-badge&logo=xampp&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #4479A1;"><img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #4169E1;"><img src="https://img.shields.io/badge/postgresql-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #DD2C00;"><img src="https://img.shields.io/badge/firebase-DD2C00.svg?style=for-the-badge&logo=firebase&logoColor=white"></div>
							</div>
							<div class="d-flex flex-column">
								<div class="w-100 m-0 p-0" style="background: #F05032;"><img src="https://img.shields.io/badge/git-F05032.svg?style=for-the-badge&logo=git&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #000000;"><img src="https://img.shields.io/badge/git bash-000000.svg?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyBoZWlnaHQ9IjI0MTkiIHZpZXdCb3g9IjMxLjk4MjU4OTI0IDMyLjI4NDUyMjcyIDEzNS41NDQ5OTY4MSAxMzIuNDk1NDc3MjgiIHdpZHRoPSIyNTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im05NS43MiA4MS40NXYxMi41NWwtMzAuMTEtMzAuMSAxMC0xMCAxNS4xOSAxNS4yYTkuNzUgOS43NSAwIDAgMCAtLjYxIDMuNDMgOS45MSA5LjkxIDAgMCAwIDUuNTMgOC45MnptOS4yMyAxLjgxIDQuNjggNC42OC00LjY4IDQuNjl6bTI4LjY0LTE5LjI2LTE4LjA5IDE4LjA3LTYuMDktNi4wN2E5LjgzIDkuODMgMCAwIDAgLjU0LTQuNjcgMTAgMTAgMCAwIDAgLTkuMzktOC42OCA5LjY0IDkuNjQgMCAwIDAgLTMuODkuNmwtMTUuMi0xNS4yNSAxMi44OC0xMi44NGE3LjM2IDcuMzYgMCAwIDEgMTAuNDIgMHoiIGZpbGw9IiNmZjgwODAiLz48cGF0aCBkPSJtODkuNzQgMTA1LjUzLTI3LjM2IDI3LjM2LTI3LjE1LTI2Ljg5YTguNDkgOC40OSAwIDAgMSAuMDktMTEuODZsMjgtMjggMjYuNDIgMjYuNTFhOS4xMiA5LjEyIDAgMCAxIDAgMTIuODh6IiBmaWxsPSIjODBiM2ZmIi8+PHBhdGggZD0ibTEwNSAxMDguNzl2MTEuNDlhOS40NiA5LjQ2IDAgMCAxIDQuNDYgOS44OCA5LjMyIDkuMzIgMCAwIDEgLTcuNDIgNy41MyA5LjQ3IDkuNDcgMCAwIDEgLTYuMzItMTcuNjl2LTEyLjdhMSAxIDAgMCAwIC0xLjYzLS42OGwtMjguNjcgMjguNjYgMjkuNSAyOS41YTcuMzMgNy4zMyAwIDAgMCAxMC4zNiAwbDI3LjgzLTI3Ljc4eiIgZmlsbD0iI2ZmZTY4MCIvPjxwYXRoIGQ9Im0xNjMuNTQgMTA3LjQ1LTI2LjU0IDI2LjU1LTI4LjU4LTI4LjU4YTguNTYgOC41NiAwIDAgMSAwLTEyLjFsMy4yOS0zLjMyIDcuMjkgNy4yN2E5LjkyIDkuOTIgMCAxIDAgNS44OC01Ljg4bC03LjI1LTcuMjQgMTguNTQtMTguNTMgMjcuMzcgMjcuMzhhMTAuMTkgMTAuMTkgMCAwIDEgMCAxNC40NXoiIGZpbGw9IiM4ZGQzNWYiLz48L3N2Zz4=&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #2b3137;"><img src="https://img.shields.io/badge/github-2b3137.svg?style=for-the-badge&logo=github&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #000000;"><img src="https://img.shields.io/badge/markdown-000000.svg?style=for-the-badge&logo=markdown&logoColor=white"></div>
							</div>
							<div class="d-flex flex-column">
								<div class="w-100 m-0 p-0" style="background: #000000;"><img src="https://img.shields.io/badge/windows_terminal-000000.svg?style=for-the-badge&logo=gnometerminal&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #EDB200;"><img src="https://img.shields.io/badge/vmware-EDB200.svg?style=for-the-badge&logo=vmware&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #4EAA25;"><img src="https://img.shields.io/badge/bash-4EAA25.svg?style=for-the-badge&logo=gnubash&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #357EC7;"><img src="https://img.shields.io/badge/WSL2-357EC7.svg?style=for-the-badge&logo=linux&logoColor=white"></div>
							</div>
							<div class="d-flex flex-column">
								<div class="w-100 m-0 p-0" style="background: #357EC7;"><img src="https://img.shields.io/badge/windows-357EC7.svg?style=for-the-badge&logo=data:image/svg%2bxml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iI2ZmZmZmZiI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiPjwvZz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+IDx0aXRsZT5taWNyb3NvZnRfd2luZG93czwvdGl0bGU+IDxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0ibm9uZSI+PC9yZWN0PiA8cGF0aCBkPSJNMywxMlY2Ljc1TDksNS40M3Y2LjQ4TDMsMTJNMjAsM3Y4Ljc1TDEwLDExLjlWNS4yMUwyMCwzTTMsMTNsNiwuMDlWMTkuOUwzLDE4Ljc1VjEzbTE3LC4yNVYyMkwxMCwyMC4wOXYtN1oiPjwvcGF0aD4gPC9nPjwvc3ZnPg==&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #A81D33;"><img src="https://img.shields.io/badge/debian-A81D33.svg?style=for-the-badge&logo=debian&logoColor=white"></div>
								<div class="w-100 m-0 p-0" style="background: #557C94;"><img src="https://img.shields.io/badge/kali-557C94.svg?style=for-the-badge&logo=kalilinux&logoColor=white"></div>
							</div>
						</div>
					</div>
				</div>
				`,
				'50',
				'65'
			);
		}
	})
});

let projectContent = ``;
let projectFlex = ``;
// ? github rest api for fetching my github repos
fetch('https://api.github.com/users/krcolonia/repos')
	.then(response => response.json())
	.then(data => 
		data.forEach(item => {
			const repos = ["JRSK-Booking", "CodeBreakers", "Yummly"]
			if(repos.some(repo => item.name.includes(repo))) {
				console.log(item);
				projectContent += `
					<div class="p-2 m-0" style="background-color: black; color: white; border-radius: 5px;">
						<p>Repo Name: ${item.name}</p>
						<p>Repo Desc: ${item.description}</p>
						<a href="${item.html_url}" target="_blank">Click here to visit repository</a>
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
	handleIconClick(this, () => {
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
	})
});

document.getElementById('contact-icon').addEventListener('click', function() {
	handleIconClick(this, () => {
		if(!activeWindows.includes('Contact Me')) {
			new DraggableWindow(
				'contact', 
				'Contact Me', 
				`<p class="m-0 p-0 w-100">content</p>`,
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
				<embed src="./objects/Colonia_Resume.pdf" class="w-100 h-100" style="border-radius: 8px;">
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