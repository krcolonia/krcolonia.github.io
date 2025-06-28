var sidebarOpen = false;

function toggleSidebar() {
	const sidebarContainer = document.getElementById('sidebarContainer');
	const sidebar = document.getElementById('sidebarNav');
	const sidebarBtnIcon = document.getElementById('sidebarBtnIcon');

	if(sidebarOpen == true) {
		sidebarContainer.style.width = '40px';
		sidebar.style.left = '-210px';
		sidebarBtnIcon.src = 'images/sidebar-open.png';
		sidebarOpen = false;
	}
	else {
		sidebarContainer.style.width = '250px';
		sidebar.style.left = '0px';
		sidebarBtnIcon.src = "images/sidebar-close.png";
		sidebarOpen = true;
	}
}

var currentTabs = [];

function addTab(tabName) {
	const tabContainer = document.getElementById('tabContainer');

	if (currentTabs.includes(tabName)) {
		return; // ? guard clause to check if the tab was already added
	}

	tabContainer.innerHTML += `<div class="menuTab d-flex flex-row justify-content-between align-content-center bg-black text-white p-1"><span>${tabName}</span><button>x</button></div>`;
	currentTabs.push(tabName);
}