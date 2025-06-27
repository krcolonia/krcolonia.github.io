const sidebarContainer = document.getElementById('sidebarContainer');
const sidebar = document.getElementById('sidebarNav');
const sidebarBtnIcon = document.getElementById('sidebarBtnIcon');

var sidebarOpen = false;

function toggleSidebar() {
	// console.log('aooga moogada tubaki')
	if(sidebarOpen == true) {
		sidebarContainer.style.width = '50px';
		sidebar.style.left = '-200px';
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

