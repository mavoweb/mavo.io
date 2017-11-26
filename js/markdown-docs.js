(function() {

Mavo.hooks.add("markdown-render-before", function(env) {
	env.markdown = env.markdown.replace(/^(Note|Tip|Warning): /mi, function($0, $1) {
		return "<p class=" + $1.toLowerCase() + ">";
	});
});

document.addEventListener("mv-markdown-render", function(evt) {
	// Create live demos
	$$(`h2[id^=demo] + pre > code.language-markup,
		h2[id^=demo] + p + pre > code.language-markup,
		h2[id^=demo] + pre > code.language-html,
			h2[id^=demo] + p + pre > code.language-html`, evt.target).forEach(function(code) {
		var markup = code.textContent;
		var pre = code.parentNode;

		var iframe = $.create("iframe", {
			srcdoc: `<!DOCTYPE html>
<head>
	<link rel="stylesheet" href="https://dev.mavo.io/dist/mavo.css" />
	<script src="https://dev.mavo.io/dist/mavo.js"></script>
</head>
<body>
${markup}
</body>
`
		});

		$.create({
			className: "example side-by-side",
			around: pre
		});

		$.create({
			className: "demo-container",
			around: pre
		});

		$.create({
			className: "example-container",
			contents: iframe,
			after: pre
		});
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
