(function() {

Mavo.hooks.add("markdown-render-before", function(env) {
	env.markdown = env.markdown.replace(/^(Note|Tip|Warning): /mig, function($0, $1) {
		return "<p class=" + $1.toLowerCase() + ">";
	});
});

document.addEventListener("mv-markdown-render", function(evt) {
	// Create live demos
	var s = Mavo.selectors;
	var demoHeading = "h2[id^=demo], h6";
	var selector = s.and(demoHeading, " + pre, + p + pre");
	selector = s.and(selector, "> code.language-markup, > code.language-html")

	$$(selector, evt.target).forEach(function createLiveDemo(code) {
		var html = code.textContent;
		var pre = code.parentNode;
		var demoHTML = `<!DOCTYPE html>
<head>
<link rel="stylesheet" href="https://dev.mavo.io/dist/mavo.css" />
<script src="https://dev.mavo.io/dist/mavo.js"></script>
</head>
<body>
${html}
</body>`;

		var siblings = [], ps = pre;

		do {
			siblings.push(ps = ps.previousElementSibling);
		} while (ps && !ps.matches(demoHeading));

		var iframe = $.create("iframe", {
			srcdoc: demoHTML,
			onload: function(evt) {
				updateIframeHeight();

				iframe.contentDocument.addEventListener("mv-load", updateIframeHeight);
			}
		});

		function updateIframeHeight() {
			var h = iframe.contentDocument.documentElement.offsetHeight;
			iframe.style.height = h + "px";
		}

		var container = $.create("section", {
			className: "example side-by-side",
			contents: [
				{
					className: "demo-container",
					contents: [
						pre,
						{
							className: "example-container",
							contents: iframe
						}
					]
				}
			],
			after: ps
		});

		$.start(siblings, container);
	});

	// Highlight code areas
	requestAnimationFrame(() => {
		$$("code", evt.target).forEach(function(element) {
			if (!element.parentNode.matches("pre")) {
				element.innerHTML = element.innerHTML.replace(/[A-Z_]{6,}/g, "<em>$&</em>");
			}

			Prism.highlightElement(element);
		});
	});
});

})();
