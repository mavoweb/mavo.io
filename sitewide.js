(function($){

if (!self.document) {
	// We're in a service worker! Oh man, we’re living in the future! 🌈🦄
	if (location.hostname === "localhost") {
		// We're testing locally, use local URLs for Mavo
		self.addEventListener("fetch", function(evt) {
			var url = evt.request.url;

			if (/\/get\.mavo\.io\/mavo\./.test(url)) {
				var response = fetch(new Request(url.replace(/^.+?get\.mavo\.io\//gi, "http://localhost:8000/dist/")), evt.request)
					.then(r => r.status < 400? r : Promise.reject())
					.catch(err => fetch(evt.request)); // if that fails, return original request

				evt.respondWith(response);
			}
		});
	}

	return;
}

var src = document.currentScript ? document.currentScript.src : "sitewide.js";

if ("serviceWorker" in navigator) {
	// Register this script as a service worker
	addEventListener('load', function() {
		navigator.serviceWorker.register(src);
	});
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

	mavoRoot.classList.add("debug-saving");
	mavoRoot.setAttribute("mv-storage", mavoRoot.getAttribute("mv-storage") || "local");
	mavoRoot.setAttribute("mv-app", mavoRoot.getAttribute("mv-app") || "");
});


})(self.Bliss)
