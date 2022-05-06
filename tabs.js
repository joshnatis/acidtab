main();

function main()
{
	let tabs = JSON.parse(localStorage["tabs"] || JSON.stringify([]));
	populateTabs(tabs);
	document.getElementById("numtabs").textContent = tabs.length + " tabs";
	enableSearchBar();
	enableButtons();
}

function populateTabs(tabs)
{
	let container = document.getElementById("container");
	for(let i = 0; i < tabs.length; ++i)
	{
		let subcontainer = document.createElement("div");
		subcontainer.className = "subcontainer";

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
		let target = ("windowId" in tabs[i]) ? tabs[i].windowId : "_blank";
		a.target = target;
		a.className = "tablinks";
		a.appendChild(tab_div);

		let x = document.createElement("p");
		x.className = "clear";
		x.textContent = "x";
		x.onclick = function() { removeTab(subcontainer); }
		tab_div.onmouseover = function() { x.style.display = "inline"; }
		subcontainer.onmouseleave = function() { x.style.display = "none"; }

		subcontainer.appendChild(a);
		subcontainer.appendChild(x);
		container.appendChild(subcontainer);
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
	let dl = document.getElementById("download");
	let ex = document.getElementById("exportData");
	let im = document.getElementById("importData");
	let clear = document.getElementById("clearAll");
	let open = document.getElementById("openAll");

	dl.onclick = download;
	ex.onclick = exportData;
	im.onclick = importData;
	clear.onclick = clearAllTabs;
	open.onclick = openAllTabs;
}

/*_____    ____ __          __ _   _  _       ____            _____  
 |  __ \  / __ \\ \        / /| \ | || |     / __ \    /\    |  __ \ 
 | |  | || |  | |\ \  /\  / / |  \| || |    | |  | |  /  \   | |  | |
 | |  | || |  | | \ \/  \/ /  | . ` || |    | |  | | / /\ \  | |  | |
 | |__| || |__| |  \  /\  /   | |\  || |____| |__| |/ ____ \ | |__| |
 |_____/  \____/    \/  \/    |_| \_||______|\____//_/    \_\|_____/ - related stuff*/ 
                                                                     
function download()
{
	let root = document.documentElement.cloneNode(true);
	let head = root.querySelector("head");

	[...head.getElementsByTagName("link")].forEach(el => el.remove());
	[...root.getElementsByTagName("script")].forEach(el => el.remove());
	root.querySelector("#download").remove();
	root.querySelector("#importData").remove();
	root.querySelector("#clearAll").remove();

	let style = document.createElement("style");
	style.textContent = cleanCSS(getAllCSS());
	head.appendChild(style);

	awaitScriptContents(document.scripts[0], function(err, response)
	{
		if(!err)
		{
			let script = document.createElement("script");
			script.innerHTML = "main();\n\n" + response;
			root.querySelector("body").appendChild(script);

			let htmlContent = [root.innerHTML.replace(/blob32.png/g, "https://picsum.photos/64")];
			let bl = new Blob(htmlContent, {type: "text/html"});
			let a = document.createElement("a");
			a.href = URL.createObjectURL(bl);
			a.download = "tabs_" + getDate() + ".html";
			a.click();
		}
	});
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

/* https://developer.mozilla.org/en-US/docs/Web/API/StyleSheetList */
function getAllCSS()
{
	const allCSS = [...document.styleSheets]
	.map(styleSheet => {
		try {
			return [...styleSheet.cssRules]
			.map(rule => rule.cssText)
			.join('');
		} catch (e) {
		}
	})
	.filter(Boolean)
	.join('\n');
	
	return allCSS;
}

function cleanCSS(css)
{
	//remove background image
	css = css.replace(/background-image: url\("[\s\S]*"\)/,
		"background-color: pink;\nbackground-image: url(\"https://picsum.photos/64\")");
	//shrink em values (because they display smaller in chrome extension)
	css = adjustEmValues(css, 0.75);
	return css;
}

function adjustEmValues(css, scale)
{
	let regex = /em/gi, result, indices = [];
	while ( (result = regex.exec(css)) )
		indices.push(result.index);

	for(let i = 0; i < indices.length; ++i)
	{
		let end = indices[i];
		let start = end;
		while(css[start] != " " && css[start] != ":")
			start--;
		let val = (scale * parseFloat(css.substring(start, end))).toFixed(2);
		css = css.substr(0, start) + val + css.substring(end);
	}
	return css;
}

/* https://stackoverflow.com/questions/148441/how-can-i-get-the-content-of-the-file-specified-as-the-src-of-a-script-tag */
/* https://stackoverflow.com/questions/4672691/ajax-responsetext-comes-back-as-undefined */
function awaitScriptContents(script, callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", script.src);
	xhr.onreadystatechange = function () {
		if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200)
			callback(null, xhr.responseText);
		else callback(xhr.statusText);
	};
	xhr.send();
}

/*______ __   __ _____    ____   _____  _______ 
 |  ____|\ \ / /|  __ \  / __ \ |  __ \|__   __|
 | |__    \ V / | |__) || |  | || |__) |  | |   
 |  __|    > <  |  ___/ | |  | ||  _  /   | |   
 | |____  / . \ | |     | |__| || | \ \   | |   
 |______|/_/ \_\|_|      \____/ |_|  \_\  |_| - related stuff*/

function exportData()
{
	let tabs = localStorage["tabs"];
	let bl = new Blob([tabs], {type: "application/json"});
	let a = document.createElement("a");
	a.href = URL.createObjectURL(bl);
	a.download = "tabs_" + getDate() + ".txt";
	a.click();
}

 /*_____  __  __  _____    ____   _____  _______ 
  |_   _||  \/  ||  __ \  / __ \ |  __ \|__   __|
    | |  | \  / || |__) || |  | || |__) |  | |   
    | |  | |\/| ||  ___/ | |  | ||  _  /   | |   
   _| |_ | |  | || |     | |__| || | \ \   | |   
  |_____||_|  |_||_|      \____/ |_|  \_\  |_| - related stuff*/   

function importData()
{
	createAndShowDialogBox();
}

function createAndShowDialogBox()
{
	let overlay = document.createElement("div");
	overlay.className = "overlay";

	let div = document.createElement("div");
	div.className = "dialog";
	div.id = "import_dialog";

	let p = document.createElement("p");
	p.textContent = "Choose an input format and enter your data.";
	p.className = "directions";

	let x = document.createElement("p");
	x.textContent = "X";
	x.className = "x";
	x.onclick = function()
	{
		div.remove();
		overlay.remove();
	}

	let form = document.createElement("form");
		let select = document.createElement("select");
			let opt1 = document.createElement("option");
			opt1.value = "acidtab";
			opt1.textContent = "Exported w/ Acid Tab";
			let opt2 = document.createElement("option");
			opt2.value = "onetab";
			opt2.textContent = "Exported w/ OneTab";
			let opt3 = document.createElement("option");
			opt3.value = "plaintext";
			opt3.textContent = "Plaintext (newline separated URLs)";
		select.appendChild(opt1);
		select.appendChild(opt2);
		select.appendChild(opt3);
		form.appendChild(select);

		let textarea = document.createElement("textarea");
		textarea.name = "imported_links";
		textarea.spellcheck = "false";
		form.appendChild(textarea);
		enableDragAndDrop(textarea);

	let submit = document.createElement("input");
	submit.type = "submit";
	submit.value = "Submit";
	submit.id = "submit";

	let checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.id = "checkbox";
	let checkbox_caption = document.createElement("p");
	checkbox_caption.id = "checkbox_caption";
	checkbox_caption.textContent = "Replace current tabs";

	submit.onclick = function()
	{
		div.remove();
		overlay.remove();

		let input_type = select.value;
		let input_tabs = textarea.value;

		if(checkbox.checked)
			clearAllTabs();

		if(input_type == "acidtab") processAcidTabInput(input_tabs);
		else if(input_type == "onetab") processOneTabInput(input_tabs);
		else if(input_type == "plaintext") processPlaintextInput(input_tabs);
	}

	div.appendChild(p);
	div.appendChild(x);
	div.appendChild(form);
	div.appendChild(submit);
	div.appendChild(checkbox);
	div.appendChild(checkbox_caption);

	let body = document.querySelector("body");
	body.appendChild(overlay);
	body.appendChild(div);
}

function displayDialog(text, error)
{
	let overlay = document.createElement("div");
	overlay.className = "overlay";

	let div = document.createElement("div");
	div.className = "dialog";

	let p = document.createElement("p");
	p.innerHTML = text;
	p.className = "directions";

	let p_err = document.createElement("p");
	p_err.textContent = error;
	p_err.className = "error_text";

	let x = document.createElement("p");
	x.textContent = "X";
	x.className = "x";
	x.onclick = function()
	{
		div.remove();
		overlay.remove();
	}

	div.appendChild(p);
	div.appendChild(x);
	div.appendChild(p_err);

	let body = document.querySelector("body");
	body.appendChild(overlay);
	body.appendChild(div);
}

function enableDragAndDrop(textarea)
{
	['dragenter', 'dragover'].forEach(e => {
		textarea.addEventListener(e, function(e) {
			e.preventDefault();
			e.stopPropagation();
			textarea.style.border = "2px solid red";
		}, false)
	});

	['dragleave', 'drop'].forEach(e => {
		textarea.addEventListener(e, function(e) {
			e.preventDefault();
			e.stopPropagation();
			textarea.style.border = "1px solid black";
		}, false)
	});

	textarea.addEventListener('drop', function(e) {
		[...e.dataTransfer.files].forEach(file => {
			if(file.type == "text/plain")
			{
				let reader = new FileReader();
				reader.onload = function(e) {
					textarea.value = reader.result;
				}
				reader.readAsText(file);
			}
		});
	}, false);
}

function processAcidTabInput(tabs)
{
	try
	{
		tabs = JSON.parse(tabs);
		let stored = JSON.parse(localStorage["tabs"] || "[{}]");
		tabs.forEach(tab => {
			stored.push(tab);
		});
		localStorage["tabs"] = JSON.stringify(stored);
		populateTabs(tabs);
		let numtabs = document.getElementById("numtabs");
		numtabs.textContent = stored.length + " tabs";
	}
	catch(err)
	{
		console.log(err);
		displayDialog("Your input was malformed.<br>Did you mean to enter plaintext?", err);
	}
}

function processOneTabInput(tabs)
{
	if(tabs.substring(0, 2) == "[{")
	{
		displayDialog("Hmm, this looks like the Acid Tab export format!", 
			new Error("Your input is not properly structured as per the OneTab format."));
		return;
	}

	try
	{
		tabs = tabs.split("\n");
		tabs = tabs.filter(el => { return el != ""; });
		let tabs_json = [];
		let stored = JSON.parse(localStorage["tabs"] || "[{}]");
		tabs.forEach(tab => {
			let datum = tab.split(/ \| (.+)/, limit = 2); // ' | ' is the onetab delimiter
			if(datum.length != 2)
				throw "\"" + tab + "\"" + " is not properly structured as per the OneTab format.";

			let obj = {};
			obj.url = datum[0];
			obj.title = datum[1];
			obj.favicon = "https://s2.googleusercontent.com/s2/favicons?domain=" + datum[0];
			stored.push(obj);
			tabs_json.push(obj);
		});
		localStorage["tabs"] = JSON.stringify(stored);
		populateTabs(tabs_json);

		let numtabs = document.getElementById("numtabs");
		numtabs.textContent = stored.length + " tabs";
	}
	catch(err)
	{
		console.log(err);
		displayDialog("Your input was malformed.<br>Did you mean to enter plaintext?", err);
	}
}

function processPlaintextInput(tabs)
{
	try
	{
		tabs = tabs.split("\n");
		tabs = tabs.filter(el => { return el != ""; });
		let tabs_json = [];
		let stored = JSON.parse(localStorage["tabs"] || "[]");
		tabs.forEach(url => {
			console.log(url);
			let obj = {};
			obj.url = url;
			obj.title = url;
			obj.favicon = "https://s2.googleusercontent.com/s2/favicons?domain=" + url;
			stored.push(obj);
			tabs_json.push(obj);
		});
		console.log(stored);
		console.log(tabs_json);
		localStorage["tabs"] = JSON.stringify(stored);
		populateTabs(tabs_json);

		let numtabs = document.getElementById("numtabs");
		numtabs.textContent = stored.length + " tabs";
	}
	catch(err)
	{
		console.log(err);
		displayDialog("Something went wrong.<br>Make sure you have one URL per line?", err);
	}
}

/*__      __       _____   _____  ____   _    _   _____ 
  \ \    / //\    |  __ \ |_   _|/ __ \ | |  | | / ____|
   \ \  / //  \   | |__) |  | | | |  | || |  | || (___  
    \ \/ // /\ \  |  _  /   | | | |  | || |  | | \___ \ 
     \  // ____ \ | | \ \  _| |_| |__| || |__| | ____) |
      \//_/    \_\|_|  \_\|_____|\____/  \____/ |_____/ things */

function removeTab(tab_container)
{
	let subcontainers = document.getElementsByClassName("subcontainer");
	let i = 0;
	while(subcontainers[i] != tab_container) i++;

	tab_container.remove();

	let numtabs = document.getElementById("numtabs");
	let val = numtabs.textContent.substr(0, numtabs.textContent.length - 5);
	numtabs.textContent = (parseInt(val) - 1) + " tabs";

	let tabs = JSON.parse(localStorage["tabs"]);
	tabs.splice(i, 1);
	localStorage["tabs"] = JSON.stringify(tabs);
}

function clearAllTabs()
{
	localStorage.clear();
	let tab_containers = document.getElementsByClassName("subcontainer");
	[...tab_containers].forEach(tab => tab.remove());
	document.getElementById("numtabs").textContent = "0 tabs";
}

function openAllTabs()
{
	let tablinks = document.getElementsByClassName("tablinks");
	let windows = {};
	[...tablinks].forEach(tab => {
		if (tab.target in windows)
			windows[tab.target].push(tab.href);
		else
			windows[tab.target] = [tab.href];
	});

	for(let id in windows)
	{
		chrome.windows.create({
			focused: false,
			state: "minimized",
			url: windows[id]
		});
	}
	return;
}