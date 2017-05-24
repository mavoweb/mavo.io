(function($){

if (!self.document) {
	// We're in a service worker! Oh man, we’re living in the future! 🌈🦄
	if (location.hostname === "localhost") {
		// We're testing locally, use local URLs for Mavo
		self.addEventListener("fetch", function(evt) {
			var url = evt.request.url;

			if (/\/get\.mavo\.io\/mavo\./.test(url)) {
				var response = fetch(new Request(url.replace(/^.+?get\.mavo\.io\//gi, "http://localhost:8000/dist/") + "?" + Date.now()), evt.request)
					.then(r => r.status < 400? r : Promise.reject())
					.catch(err => fetch(evt.request)); // if that fails, return original request

				evt.respondWith(response);
			}
		});
	}

	return;
}

var src = document.currentScript ? document.currentScript.src : "sitewide.js";

if ("serviceWorker" in navigator && location.hostname == "localhost") {
	// Register this script as a service worker
	addEventListener('load', function() {
		navigator.serviceWorker.register(src);
	});
}

if (parent && parent !== window || new URL(location).searchParams.get("lite") !== null) {
	document.documentElement.classList.add("lite")
}

// Create the live examples
$$(".example:not(.manual)").forEach((example, i) => {
	example.id = example.id || "example" + (i + 1);

	if (!$("h1", example)) {
		$.create("h1", {
			textContent: "Example",
			start: $("header", example) || example
		});
	}

	var code = $("script[type='text/plain']", example);

	var container = $.create({
		className: "example-container",
		innerHTML: code.textContent,
		after: code
	});

	var mavoRoot = $("[mv-app], [mv-storage]", container) || container;

	if (!example.classList.contains("no-fixup")) {
		mavoRoot.classList.add("debug-saving");
		mavoRoot.setAttribute("mv-storage", mavoRoot.getAttribute("mv-storage") || "local");
		mavoRoot.setAttribute("mv-app", mavoRoot.getAttribute("mv-app") || "");
	}
});

$$(".example-container > iframe").forEach(iframe => {
	$.events(iframe, "DOMFrameContentLoaded load", () => {
		var root = iframe.contentDocument.documentElement;

		$.style(root, {
			"font-size": "85%",
			"box-sizing": "border-box"
		});

		//iframe.style.height = root.offsetHeight - 29 + "px";

		var height = 0;
		Mavo.observeResize(root, e => {
			if (height != root.offsetHeight) {
				iframe.style.height = root.offsetHeight + "px";
				height = root.offsetHeight
			}

		});
	});
});

if (/^\/demos\/\w+\/$/.test(location.pathname)) {
	$.fetch(location.href).then(xhr => {
		var html = Mavo.match(xhr.responseText, /<main[\S\s]+<\/main>/i);
		var pre;

		html = `<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>${document.title}</title>
	<script src="https://get.mavo.io/mavo.js"></script>
	<link rel="stylesheet" href="https://get.mavo.io/mavo.css">
	<link rel="stylesheet" href="style.css">
</head>
<body>

${html}

</body>
`;

		$.create("section", {
			id: "code",
			contents: [
				{tag: "h1", textContent: "Mavo HTML"},
				pre = $.create({
					tag: "pre",
					contents: {tag: "code", textContent: html},
					className: "language-markup"
				})
			],
			after: $("body > section:last-of-type")
		});

		Prism.highlightElement(pre);
	});
}

$$("pre > code a[aria-label]").forEach(a => a.target = "_blank");

$$("section.advanced").forEach(section => {
	var thing = section.getAttribute("data-required") || "JavaScript";

	$.create("p", {
		className: "notice warning",
		textContent: `This section requires an understanding of ${thing}. It is aimed at advanced users and plugin developers. You do not need to understand ${thing} to use Mavo!`,
		after: $("h1, h2", section)
	});
})

})(self.Bliss)
