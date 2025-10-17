/* 
? draggable window code borrowed from w3schools with some slight modifications
? https://www.w3schools.com/howto/howto_js_draggable.asp
*/

// TODO -> make the function flexible towards multiple windows in the case that I add in all the other content

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
// ? Mouse Click Sounds
const leftClickSound = new Audio('../sounds/mouseleft.ogg')
const rightClickSound = new Audio('../sounds/mouseright.ogg')

document.addEventListener('click', () => {
	leftClickSound.currentTime = 0;
	leftClickSound.play();
})

document.addEventListener('contextmenu', () => {
	rightClickSound.currentTime = 0;
	rightClickSound.play();
});
//#endregion

// TODO -> i might actually steal (borrow) some code from w3schools again lmao. I love programming https://www.w3schools.com/html/html5_draganddrop.asp