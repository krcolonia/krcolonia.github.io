//#region // ? Sidebar Functionality
var sidebarOpen = false;

function toggleSidebar() {
	const sidebarContainer = document.getElementById('sidebarContainer');
	const sidebar = document.getElementById('sidebarNav');
	const sidebarBtnIcon = document.getElementById('sidebarBtnIcon');

	if(sidebarOpen == true) {
		sidebarContainer.style.width = '42px';
		sidebar.style.left = '-208px';
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
//#endregion

//#region // ? In-site Tab Functionality
var currentTabs = [];
var activeTab = "Home";
var prevTab = "Home";

function addTab(tabName) {
	const tabContainer = document.getElementById('tabContainer');

	if (currentTabs.includes(tabName)) {
		return; // ? guard clause to check if the tab was already added
	}

	tabContainer.innerHTML += `
	<div class="menuTab d-flex flex-row justify-content-between align-content-center p-1" id="${tabName}Tab">
		<span class="flex-grow-1 mt-1" onClick="setCurrentTab('${tabName}')">${tabName}</span>
		<button class="tabClose my-auto d-flex" onClick="removeTab('${tabName}')">
			<img src="images/close.png">
		</button>
	</div>`;
	currentTabs.push(tabName);
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
}
//#endregion