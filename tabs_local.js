function main()
{
	enableSearchBar();
	enableButtons();
}

function populateTabs(tabs)
{
	let container = document.getElementById("container");
	for(let i = 0; i < tabs.length; ++i)
	{
		let tab_div = document.createElement("div");
		tab_div.className = "tab";

		let p = document.createElement("p");
		p.innerText = tabs[i].title;

		let favicon = document.createElement("img");
		favicon.src = ("favicon" in tabs[i]) ? tabs[i].favicon : "blob32.png";
		favicon.className = "favicon";

		tab_div.appendChild(favicon);
		tab_div.appendChild(p);

		let a = document.createElement("a");
		a.href = tabs[i].url;
		a.target = "_blank";
		a.className = "tablinks";
		a.appendChild(tab_div);

		container.appendChild(a);
	}
}

function enableSearchBar()
{
	let tablinks = document.getElementsByClassName("tablinks");
	let tabs = document.getElementsByClassName("tab");

	let search = document.getElementById("search");
	search.oninput = function() {
		let input = document.getElementById("search").value.toLowerCase();
		for(let i = 0; i < tabs.length; ++i)
		{
			let title = (tabs[i].getElementsByTagName("p")[0].innerText).toLowerCase();
			let url = tablinks[i].href;
			if(title.indexOf(input) != -1 || url.indexOf(input) != -1)
				tabs[i].style.display = "";
			else
				tabs[i].style.display = "none";
		}
	}
}

function enableButtons()
{
	let ex = document.getElementById("exportData");
	ex.onclick = exportData;
}

/* https://stackoverflow.com/questions/1531093/how-do-i-get-the-current-date-in-javascript */
function getDate()
{
	let today = new Date();
	let dd = String(today.getDate()).padStart(2, '0');
	let mm = String(today.getMonth() + 1).padStart(2, '0');
	let yyyy = today.getFullYear();
	let hr = String(today.getHours()).padStart(2, '0');
	let min = String(today.getMinutes()).padStart(2, '0');

	today = mm + "_" + dd + "_" + yyyy + "_" + hr + "-" + min;
	return today;
}

/*______ __   __ _____    ____   _____  _______ 
 |  ____|\ \ / /|  __ \  / __ \ |  __ \|__   __|
 | |__    \ V / | |__) || |  | || |__) |  | |   
 |  __|    > <  |  ___/ | |  | ||  _  /   | |   
 | |____  / . \ | |     | |__| || | \ \   | |   
 |______|/_/ \_\|_|      \____/ |_|  \_\  |_| - related stuff*/

function exportData()
{
	let tablinks = document.getElementsByClassName("tablinks");
	let tabdivs = document.getElementsByClassName("tab");
	let tab_json = [];

	for(let i = 0; i < tablinks.length; ++i)
	{
		let obj = {};
		obj.url = tablinks[i].href;
		obj.title = tabdivs[i].childNodes[1].textContent;
		obj.favicon = tabdivs[i].childNodes[0].src;
		tab_json.push(obj);
	}

	let bl = new Blob([JSON.stringify(tab_json)], {type: "application/json"});
	let a = document.createElement("a");
	a.href = URL.createObjectURL(bl);
	a.download = "tabs_" + getDate() + ".txt";
	a.click();
}