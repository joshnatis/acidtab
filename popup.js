document.addEventListener('DOMContentLoaded', function() {
	document.getElementById("current_window").addEventListener('click', onclick_currWin, false);
	document.getElementById("all_windows").addEventListener('click', onclick_allWin, false);
	document.getElementById("display").addEventListener('click', onclick_display, false);



	function onclick_currWin() {
		chrome.tabs.query({currentWindow: true},
		function(tabs) {
			let tabs_collection = [];
			for(let i = 0; i < tabs.length; ++i)
				tabs_collection.push({"url": tabs[i].url, "title": tabs[i].title, "favicon": tabs[i].favIconUrl});
			localStorage["tabs"] = JSON.stringify(tabs_collection);
			window.open("./tabs.html");
		})
	}

	function onclick_allWin() {
		chrome.tabs.query({}, function(tabs) {
			let tabs_collection = [];
			for(let i = 0; i < tabs.length; ++i)
				tabs_collection.push({"url": tabs[i].url, "title": tabs[i].title, "favicon": tabs[i].favIconUrl});
			localStorage["tabs"] = JSON.stringify(tabs_collection);
			window.open("./tabs.html");
		})
	}

	function onclick_display() {
		window.open("./tabs.html");
	}
}, false)

//todo: windows?