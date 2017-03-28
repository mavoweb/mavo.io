// Create the live examples
$$(".example").forEach((example, i) => {
	example.id = example.id || "example" + (i + 1);

	if (!$("h1", example)) {
		$.create("h1", {
			textContent: "Example",
			start: example
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

// ???
$$('a[href^="#"]:empty').forEach(function (a) {
	a.textContent = a.getAttribute("href").slice(1);
});

// Give every section an id and make its heading a link
$$("body > section > h1, body > section section > h1").forEach(function (h1) {
	var section = h1.parentNode;
	var text = h1.textContent;

	if (!section.id) {
		section.id = text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
	}

	h1.textContent = "";

	$.create("a", {
		href: "#" + section.id,
		textContent: text,
		inside: h1
	});
});

// Build Table Of Contents for current page
if (!document.body.classList.contains("no-toc")) {
	let toc = [];

	$$("body > section:not(.no-toc) > h1").forEach(function (h1) {
		toc.push($.create("li", {
			contents: {
				tag: "a",
				href: "#" + h1.parentNode.id,
				textContent: h1.textContent
			}
		}));
	});

	$.create("nav", {
		id: "toc",
		className: "no-toc",
		contents: {
			tag: "details",
			open: true,
			contents: [
				{
					tag: "summary",
					textContent: "On This Page"
				},
				{
					tag: "ul",
					contents: toc
				}
			]
		},
		before: $("body > section:first-of-type")
	});
}
