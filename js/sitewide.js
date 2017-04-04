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
