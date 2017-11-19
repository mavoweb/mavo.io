// Print out URL for empty non-local links
$$('a[href^="#"]:empty:not([property])').forEach(function (a) {
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

$$("ul.index > li > a").forEach(function(a) {
	if (a.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "")) {
		a.parentNode.remove();
	}
});
