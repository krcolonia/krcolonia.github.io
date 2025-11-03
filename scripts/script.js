/* 
? draggable window code borrowed from w3schools with some slight modifications
? https://www.w3schools.com/howto/howto_js_draggable.asp

? my portfolio site also takes huge inspiration from Shar Yap's portfolio
? check it here: https://www.sharyap.com/
*/

// ? Mouse Click Sounds
//#region
var canClick = false
const leftClickSound = new Audio('../sounds/mouseleft.ogg')
const rightClickSound = new Audio('../sounds/mouseright.ogg')

document.addEventListener('click', () => {
	if(canClick) {
		leftClickSound.currentTime = 0
		leftClickSound.play()
	}
})

document.addEventListener('contextmenu', (e) => {
	if(canClick) {
		rightClickSound.currentTime = 0
		rightClickSound.play()
	}
	e.preventDefault() 
}, false)
//#endregion

// ? Draggable Window object
//#region
let activeWindows = []
const taskbarContainer = document.getElementById('taskbar-apps')

class DraggableWindow {
	static highestZ = 1000

	constructor(icon, title, content, width, height, scrollable = false) {
		this.id = `window-${Date.now()}-${Math.random()}`
		this.element = this.createWindow(icon, title, content, width, height, scrollable)
		this.makeDraggable()
	}

	createWindow(icon, title, content, width, height, scrollable = false) {

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
			<div class="desktop-window-content flex-grow-1 p-4 ${scrollStyle}">${content}</div>
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

	loadingText.innerText = "Welcome back, Kurt Colonia."

	await new Promise(resolve => setTimeout(resolve, 1500))

	loadingElement.classList.remove('opacity-100')
	loadingElement.classList.add('opacity-0')

	await new Promise(resolve => setTimeout(resolve, 1000))

	loadingElement.classList.remove('d-flex')
	loadingElement.classList.add('d-none')
	canClick = true

	// new DraggableWindow(
	// 'guide',
	// 'User Guide',
	// guideContent,
	// guideWidth,
	// guideHeight
	// )

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

// * About Me
const aboutContent = `
<div class="d-flex flex-row py-4 justify-content-center align-items-center gap-3" id="about-header">
	<img src="./images/PFP_suit.png" class="rounded-circle m-0 p-0" style="width: 20%; border: 2px solid black;">
	<div class="d-flex flex-column align-items-center" style="text-shadow: 2px 2px 2px black">
		<h1 class="fw-bold m-0 p-0">Kurt Robin Colonia</h1>
	</div>
</div>
<div class="p-4 m-0 d-flex justify-content-center" id="commit-hist">
	<img src="http://ghchart.rshah.org/861198/krcolonia" alt="krcolonia's Github commit history" align="center"/>
</div>
<div id="about-content" class="p-3 m-0">
	<h3 class="p-0 m-0 mb-2" align="center">Hello World, I'm Kurt!</h3>
	<p>I'm an <b>IT graduate</b> and <b>developer</b> with experience on web and mobile applications.<br class="mb-3">My tech stack includes:</p>
	<ul>
		<li>HTML5, CSS3, JavaScript, TypeScript, and PHP</li>
		<li>Laravel, React.JS + Vite</li>
		<li>Tailwind CSS, Bootstrap 5</li>
		<li>Android Studio, Kotlin</li>
		<li>Git with Github and Gitlab</li>
	</ul>

	<p>Other than programming and developing applications, I've also had the chance to work with:</p>
	<ul>
		<li>Database Management</li>
		<li>REST API design and integration</li>
		<li>Basic web penetration testing</li>
		<li>Mobile game development with Godot</li>
	</ul>
</div>
`
const aboutWidth = '50'
const aboutHeight = '80'

// * My Projects
let projectCard = ``
let projectContent = ``
let projectWidth = '60'
let projectHeight = '65'
// ? github rest api for fetching my github repos
fetch('https://api.github.com/users/krcolonia/repos')
	.then(response => response.json())
	.then(data => 
		data.forEach(item => {
			const repos = ["JRSK-Booking", "CodeBreakers", "Yummly", "GameSRC", "Java_", "krcolonia.github.io"]

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
							<p class="text-xl fw-bold m-0 p-0">${item.name}</p>
							<hr class="my-2 p-0">
							<div class="d-flex flex-row justify-content-between mb-3">
								<span class="github-details fw-normal fst-italic p-0 m-0">Uploaded ${uploadDate}</span>
								<span class="github-details fw-normal fst-italic p-0 m-0">Developed using ${language}</span>
							</div>
						</div>
						<p style="text-indent: 25px text-align: justify">${item.description}</p>
						<div class="d-flex flex-row justify-content-between">
							<a href="${item.html_url}" target="_blank" class="github-card-button p-1">Visit Repository</a>
							${homepage}
						</div>
					</div>
				`

				projectContent = `
				<div class="d-flex flex-column gap-3 p-0 m-0">
					${projectCard}
				</div>
				`
			}
		})
	)
	.catch(error => console.error('Error:', error))

// * Contact Me
const contactContent = `
<p class="m-0 p-0 w-100">content</p>
`
const contactWidth = '45'
const contactHeight = '50'

// * My Resume
const resumeContent = `
<embed src="./objects/Colonia_Resume.pdf" class="w-100 h-100" style="border-radius: 8px">
`
const resumeWidth = '50'
const resumeHeight = '85'

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
	}
})

document.getElementById('resume-icon').addEventListener('click', function() {
	if(!activeWindows.includes('My Résumé')) {
		new DraggableWindow(
			'file', 
			'My Résumé', 
			resumeContent,
			resumeWidth,
			resumeHeight
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
