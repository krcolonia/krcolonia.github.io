/* 
? draggable window code borrowed from w3schools with some slight modifications
? https://www.w3schools.com/howto/howto_js_draggable.asp

? my portfolio site also takes huge inspiration from Shar Yap's portfolio
? check it here: https://www.sharyap.com/
*/

import { db } from './FirebaseInit.js'
import { ref, get, query, orderByKey, limitToLast } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js'

// ? Mouse Click Events
//#region
var canClick = false
var showHidden = false
const leftClickSound = new Audio('../sounds/mouseleft.ogg')
const rightClickSound = new Audio('../sounds/mouseright.ogg')

const contextMenu = document.getElementById('contextMenu')

document.addEventListener('click', () => {
	if(canClick) {
		leftClickSound.currentTime = 0
		leftClickSound.play()
	}

	contextMenu.style.display = 'none';
})

document.addEventListener('contextmenu', (e) => {
	if(canClick) {
		rightClickSound.currentTime = 0
		rightClickSound.play()

		const clickedElement = e.target
		contextMenu.innerHTML = ''

		if(clickedElement.classList.contains('link-app')) {
			addContextItem('Link', clickedElement.id)
		}
		else {
			if(!showHidden) { addContextItem('Show Secrets', 'show-secret'); showHidden = true; }
			else { addContextItem('Hide Secrets', 'hide-secret'); showHidden = false; }
		}

		contextMenu.style.display = 'block';
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
	}
	e.preventDefault() 
}, false)

contextMenu.addEventListener('click', (e) => {
    if(e.target.classList.contains('context-menu-item')) {
        const action = e.target.dataset.action;
        console.log('Action:', action);
		const hidden = document.getElementsByClassName('hidden-app');

		switch(action) {
			case 'show-secret':
				for (const app of hidden) {
					app.classList.remove('d-none');
					app.classList.add('d-flex');
				}
				break;
			case 'hide-secret':
				for (const app of hidden) {
					app.classList.remove('d-flex');
					app.classList.add('d-none');
				}
				break;
		}
    }
});

function addContextItem (text, action) {
	const item = document.createElement('div')
	item.className = 'context-menu-item'
	item.textContent = text
	item.dataset.action = action
	contextMenu.appendChild(item)
}
//#endregion

// ? Draggable Window object
//#region
let activeWindows = []
const taskbarContainer = document.getElementById('taskbar-apps')

class DraggableWindow {
	static highestZ = 1000

	constructor(icon, title, content, width, height, scrollable = false, padding = 3) {
		this.id = `window-${Date.now()}-${Math.random()}`
		this.element = this.createWindow(icon, title, content, width, height, padding, scrollable)
		this.makeDraggable()
	}

	createWindow(icon, title, content, width, height, padding, scrollable) {

		let scrollStyle = ''
		if (scrollable) {
			scrollStyle = ' overflow-y-auto'
		}

		const windowElement = document.createElement('div')
		windowElement.id = this.id
		windowElement.className = 'desktop-window'
		windowElement.classList.add('d-flex')
		windowElement.style.width = width + 'vw'
		windowElement.style.height = height + 'vh'
		windowElement.style.opacity = 0
		windowElement.style.zIndex = ++DraggableWindow.highestZ
		windowElement.innerHTML = `
			<div class="desktop-window-header p-0">
				<div class="p-2 d-flex gap-2 justify-content-start align-items-center">
						<img src="./images/desktop-icons/${icon}.png" class="desktop-window-icon h-100"/><span>${title}</span>
				</div>
				<div class="p-2 d-flex justify-content-end align-items-center">
					<button class="window-actions d-flex border-0 bg-transparent h-100" id="minimize-window">
						<img src="./images/minimize.png" class="h-100">
					</button>
					<button class="window-actions d-flex border-0 bg-transparent h-100" id="close-window">
						<img src="./images/close.png" class="h-100">
					</button>
				</div>
			</div>
			<div class="desktop-window-content flex-grow-1 p-${padding} ${scrollStyle}">${content}</div>
		`

		const taskbarButton = document.createElement('button')
		taskbarButton.className = 'taskbar-icon border-0 h-100 p-2'
		taskbarButton.id = `taskbar-${icon}`
		taskbarButton.innerHTML = `<img src="./images/desktop-icons/${icon}.png" class="h-100" style="padding:2px">`
		taskbarContainer.appendChild(taskbarButton)

		activeWindows.push(title)
		document.body.appendChild(windowElement)

		const closeButton = windowElement.querySelector('#close-window')
		closeButton.addEventListener('click', () => {
			windowElement.remove()
			document.getElementById(`taskbar-${icon}`).remove()
			activeWindows = activeWindows.filter(item => item !== title)

			if (activeWindows === undefined || activeWindows.length == 0) {
				DraggableWindow.highestZ = 1000
			}
		})

		const minButton = windowElement.querySelector('#minimize-window')
		minButton.addEventListener('click', () => {
			windowElement.classList.remove('d-flex')
			windowElement.classList.add('d-none')
		})

		const taskbarIcon = document.getElementById(`taskbar-${icon}`)

		taskbarIcon.addEventListener('mousedown', () => {
			this.bringToFront()
			if(windowElement.classList.contains('d-none')) {
				windowElement.classList.remove('d-none')
				windowElement.classList.add('d-flex')
			}
		})

		const windowWidth = windowElement.offsetWidth
		const windowHeight = windowElement.offsetHeight
		const viewportWidth = window.innerWidth
		const viewportHeight = window.innerHeight - 45

		windowElement.style.left = (viewportWidth - windowWidth) / 2 + "px"
		windowElement.style.top = (viewportHeight - windowHeight) / 2 + "px"

		void windowElement.offsetHeight

		setTimeout(() => {
			windowElement.style.opacity = 100
		}, 50)

		return windowElement
	}

	bringToFront() {
		if (this.element.style.zIndex != DraggableWindow.highestZ) {
			this.element.style.zIndex = ++DraggableWindow.highestZ
		}
	}

	makeDraggable() {
		const header = this.element.querySelector('.desktop-window-header')
		let isDragging = false
		let currentX, currentY, initialX, initialY

		this.element.addEventListener('mousedown', () => {
			this.bringToFront()
		})

		header.addEventListener('mousedown', (e) => {
			isDragging = true
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
			isDragging = false
		})
	}
}
//#endregion

// ? Loading Screen
//#region
async function loadingScreen() {
	const loadingElement = document.getElementById('loading-screen')
	const loadingIcon = document.getElementById('loading-icon')
	const loadingText = document.getElementById('loading-text')
	const loadingPfp = document.getElementById('loading-pfp')

	await new Promise(resolve => setTimeout(resolve, 5500))
	
	loadingPfp.classList.remove('opacity-0')
	loadingPfp.classList.add('opacity-100')

	loadingIcon.classList.remove('opacity-100')
	loadingIcon.classList.add('opacity-0')

	loadingText.innerText = "Welcome to krColonia's Portfolio"

	await new Promise(resolve => setTimeout(resolve, 2500))

	loadingElement.classList.remove('opacity-100')
	loadingElement.classList.add('opacity-0')

	await new Promise(resolve => setTimeout(resolve, 1000))

	loadingElement.classList.remove('d-flex')
	loadingElement.classList.add('d-none')
	loadingElement.remove()
	canClick = true

	new DraggableWindow(
	'scrapbook',
	'About Me',
	aboutContent,
	aboutWidth,
	aboutHeight,
	true
	)
}

loadingScreen()
//#endregion

// ? Taskbar Date and Time section
//#region
function startTime() {
	const today = new Date()
	var hours = today.getHours()
	var minutes = today.getMinutes()
	var seconds = today.getSeconds()
	var ampm = hours >= 12 ? 'PM' : 'AM'
	hours = hours % 12
	hours = hours ? hours : 12
	minutes = minutes < 10 ? '0'+minutes : minutes
	document.getElementById('taskbar-clock').innerHTML = hours + ':' + minutes + ' ' + ampm
	setTimeout(startTime, 1000)
}

startTime()

document.getElementById('currentYear').textContent = new Date().getFullYear()
//#endregion

// ? Taskbar Menu
//#region
let startMenu = document.getElementById('start-menu')
let startMenuScreen = document.getElementById('start-menuScreen')
document.getElementById('start-button').addEventListener('mousedown', function() {
	if(startMenu.classList.contains('d-none')) {
		startMenu.classList.remove('d-none')
		startMenu.classList.add('d-flex')
		startMenuScreen.classList.remove('d-none')
		startMenuScreen.classList.add('d-flex')
	}
	else {
		startMenu.classList.remove('d-flex')
		startMenu.classList.add('d-none')
		startMenuScreen.classList.remove('d-flex')
		startMenuScreen.classList.add('d-none')
	}
})

startMenuScreen.addEventListener('mousedown', function() {
	if(startMenuScreen.classList.contains('d-flex')) {
		startMenu.classList.remove('d-flex')
		startMenu.classList.add('d-none')
		startMenuScreen.classList.remove('d-flex')
		startMenuScreen.classList.add('d-none')
	}
})

//#endregion

// ? Automatic redirect if on mobile screens
//#region
if (window.innerWidth < 768) {
	window.location.replace('./portfolio')
}
//#endregion

// ? Desktop App Content
//#region

// * User Guide (currently unused because I think it should go unused...? kept in case i change my mind aaaa)
const guideContent = `
<h3 class="fw-bold" align="center">Welcome to Kurt Colonia's Portfolio!</h3>
<p class="m-0 p-0 h-100 w-100" style="text-indent: 25px; text-align: justify; text-justify: inter-word;">
	This is the current iteration/redesign of my web portfolio! I wanted to make my portfolio look like a desktop environment to make my portfolio a bit more unique compared to other people's portfolio.<br><br>
	If you'd like to view a more traditional style of web portfolio, <a href="./portfolio">Click here!</a>
</p>
`
const guideWidth = '70'
const guideHeight = '65'

// ? subtracts date of my first prof. exp to the current date so that i wont have to update this stuff manually
let yearsExp = new Date().getFullYear() - new Date("2024-09-16").getFullYear()

// * About Me
const aboutContent = `
<div class="d-flex flex-row py-4 justify-content-center align-items-center gap-3" id="about-header">
	<img src="./images/PFP_suit.png" class="rounded-circle m-0 p-0" style="width: 20%; border: 2px solid black;">
	<div class="d-flex flex-column align-items-center">
		<h1 class="fw-bold m-0 p-0 mt-3">&lt;krColonia&gt;</h1>
		<p style="font-family:'unageo';"><i class="fa-solid fa-location-dot"></i> Quezon City, Philipppines</p>
	</div>
</div>
<div class="p-0 m-0 d-flex flex-column justify-content-center align-items-center" id="commit-hist">
	<p class="p-3 pb-1 m-0">My Github Contributions</p>
	<img src="http://ghchart.rshah.org/861198/krcolonia" class="px-4 pb-4" alt="krcolonia's Github commit history" align="center"/>
</div>
<div id="about-content" class="p-3 m-0">
	<h3 class="p-0 m-0 mb-2" align="center">Hello World, I'm Kurt!</h3>
	<p>
		I'm a ${new Date().getFullYear() - new Date("2002-12-20").getFullYear()}-year-old full stack web developer based in the Philippines, with over ${(yearsExp > 1) ? yearsExp+"+" : "a"} year${(yearsExp > 1) ? "s" : ""} of professional experience in the tech industry building user-friendly software and applications.
	</p><br>
	<p>
		My love for computers started with experimenting on browser developer tools and modifying the games I play for fun, which eventually lead me to learn programming seriously back in 11th grade and started building on my skills ever since.
	</p><br>
	<p>
		I've worked on multiple web application projects using ReactJS with Vite, Tailwind CSS, Bootstrap, jQuery AJAX, and the Laravel Framework, as well as Android apps built with Android Studio and Kotlin.
		<!-- My tech stack includes:
		<ul>
			<li>HTML5, CSS3, JavaScript, TypeScript, and PHP</li>
			<li>Laravel, React.JS + Vite</li>
			<li>Tailwind CSS, Bootstrap 5</li>
			<li>Android Studio, Kotlin</li>
			<li>Git with Github and Gitlab</li>
		</ul>
		-->
	</p><br>
	<p>
		Other than programming and developing web and mobile applications, I've also had the chance to work on projects with:
		<ul>
			<li>Database Management</li>
			<li>REST API design and integration</li>
			<li>Basic web penetration testing</li>
			<li>Game development with Godot (Android and PC)</li>
		</ul>
	</p>
</div>
`
const aboutWidth = '50'
const aboutHeight = '80'

// * My Projects
let projectCard = ``

let projectContent = ``
let projectWidth = '45'
let projectHeight = '65'

fetch('https://api.github.com/users/krcolonia/repos')
	.then(response => response.json())
	.then(data => 
		data.forEach(item => {
			const repos = ["JRSK", "CodeBreakers", "Yummly", "GameSRC", "Java_", "krcolonia.github.io"]

			if(repos.some(repo => item.name.includes(repo))) {
				let homepage = ``

				let uploadDate = new Date(item.created_at).toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric'
				})

				let language = item.language

				if (language === "Blade") {
					language = 'Laravel'
				}

				// ? I don't like nesting if statements, but my caveman brain can't currently think of a better solution
				if(item.homepage != null) {
					if (item.homepage.length != 0) {
						homepage = `
						<a href="${item.homepage}" target="_blank" class="github-card-button p-1">View Deployed Page</a>
						`
					}
				}

				projectCard += `
					<div class="p-3 m-0 github-card" id="${item.name}">
						<div class="d-flex flex-column m-0 p-0">
							<p class="fw-bold m-0 p-0">${item.name}</p>
							<hr class="my-2 p-0">
							<div class="d-flex flex-row justify-content-between mb-3">
								<span class="github-details fw-normal fst-italic p-0 m-0">Uploaded ${uploadDate}</span>
								<span class="github-details fw-normal fst-italic p-0 m-0">Developed using ${language}</span>
							</div>
						</div>
						<p style="text-indent: 25px; text-align: justify;">${item.description}</p>
						<div class="d-flex flex-row justify-content-between">
							<a href="${item.html_url}" target="_blank" class="github-card-button p-1">Visit Repository</a>
							${homepage}
						</div>
					</div>
				`
			}
		})
	)
	.catch(error => console.error('Error:', error))

// * Contact Me
const contactContent = `
<!-- <p class="m-0 p-0 w-100">content to be added</p> -->
<div class="d-flex flex-column justify-content-center align-items-center h-100">
	<h1 class="text-center m-0 pb-2">Have a project in mind or just wanna talk?</h1>
	<p class="text-center m-0 pb-3" style="font-size: 1.3rem;">Reach out via my email! I seldomly check direct messages on my socials, but I'm quite active in checking my email inbox!</p>
	<button id="send-email" class="p-0 px-2 m-0 github-card-button" style="font-size: 1.3rem;">Click here send me an email!</button>
</div>
`
const contactWidth = '45'
const contactHeight = '50'

// * My Resume
let resumeCard = ``
let resumeContent = ``
const resumeWidth = '50'
const resumeHeight = '90'

const exp = [];
// ? github rest api for fetching my github repos
get(query(ref(db, 'emp'), orderByKey(), limitToLast(100))).then(snapshot => {
	if(snapshot.exists) {
		snapshot.forEach(item => {
			if(item.key != 'lastId') {
				let startDate = item.val().start;
				let endDate = item.val().end;

				if(startDate) {
					const [startMonth, startYear] = item.val().start.split('-')
					startDate = new Date(startYear, startMonth-1).toLocaleDateString('en-US', 
					{ 
						year: 'numeric', 
						month: 'long' 
					});
				}

				if(endDate != 'Present' && endDate) {
					const [endMonth, endYear] = endDate.split('-')
					endDate = new Date(endYear, endMonth-1).toLocaleDateString('en-US', 
					{ 
						year: 'numeric', 
						month: 'long' 
					});
				}
				
				exp.unshift({
					id: item.val().id ? item.val().id : '[no data]',
					title: item.val().title ? item.val().title : '[no data]',
					empType: item.val().empType ? item.val().empType : '[no data]',
					company: item.val().company ? item.val().company : '[no data]',
					start: startDate ? startDate : '[no data]',
					end: endDate ? endDate : '[no data]',
					description: item.val().description ? item.val().description : '[no data]',
				})
			}
		})

		exp.forEach(item => {
			resumeCard += `
					<div class="p-3 m-0 github-card" id="${item.id}">
						<div class="d-flex flex-column m-0 p-0">
							<div class="d-flex flex-row gap-2 justify-content-start align-items-end">
								<p class="fw-bold m-0 p-0">${item.title}</p>
								<p class="m-0 p-0 fst-italic" style="font-size: 0.85rem;">${item.company}, ${item.empType}</p>
							</div>
							<hr class="my-2 p-0">
							<div class="d-flex flex-row justify-content-start gap-4 mb-3">
								<span class="github-details fw-normal fst-italic p-0 m-0">${item.start} - ${item.end}</span>
								<span class="github-details fw-normal fst-italic p-0 m-0"></span>
							</div>
						</div>
						<p style="text-indent: 25px; text-align: justify;">${item.description}</p>
					</div>
				`
		})
	}
})

document.getElementById('about-icon').addEventListener('click', function() {
	if(!activeWindows.includes('About Me')) {
		new DraggableWindow(
			'scrapbook', 
			'About Me', 
			aboutContent,
			aboutWidth,
			aboutHeight,
			true
		)
	}
})

document.getElementById('project-icon').addEventListener('click', function() {
	projectContent = `
				<div class="d-flex flex-column gap-3 p-0 m-0">
					${projectCard}
				</div>
				`
	if(!activeWindows.includes('My Projects')) {
		new DraggableWindow(
			'projects', 
			'My Projects', 
			projectContent,
			projectWidth,
			projectHeight,
			true
		)
	}
})

document.getElementById('contact-icon').addEventListener('click', function() {
	if(!activeWindows.includes('Contact Me')) {
		new DraggableWindow(
			'contact', 
			'Contact Me', 
			contactContent,
			contactWidth,
			contactHeight
		)
		document.getElementById('send-email').addEventListener('click', function() {
			window.open(
				'mailto:krcolonia@gmail.com', 
				'_blank'
			)
		})
	}
})

document.getElementById('resume-icon').addEventListener('click', function() {
	resumeContent = `
<div class="d-flex flex-column gap-2">
	${resumeCard}
	<div class="d-flex flex-row justify-content-between px-5 align-items-center github-card gap-2" id="resume-download-card">
		<p class="p-0 m-0 my-4 text-center">Want a copy of my Résumé?</p>
		<a class="p-0 m-0 my-4 github-card-button text-center" href="./objects/Colonia_Resume.pdf" download="Colonia_Resume.pdf">Click here to grab one!</a>
	</div>
</div>
`

	if(!activeWindows.includes('Work Experience')) {
		new DraggableWindow(
			'file', 
			'Work Experience', 
			resumeContent,
			resumeWidth,
			resumeHeight,
			true
		)
	}
})

document.getElementById('linkedin-icon').addEventListener('click', function() {
	window.open(
		'https://www.linkedin.com/in/krcolonia/', 
		'_blank'
	)
})

document.getElementById('github-icon').addEventListener('click', function() {
	window.open(
		'https://github.com/krcolonia', 
		'_blank'
	)
})

document.getElementById('gmail-icon').addEventListener('click', function() {
	window.open(
		'mailto:krcolonia@gmail.com', 
		'_blank'
	)
})
//#endregion
