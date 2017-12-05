(function($, $$){

// Print out URL for empty non-local links
$$('a[href^="#"]:empty:not([property])').forEach(function (a) {
	a.textContent = a.getAttribute("href").slice(1);
});

// Give every section an id and make its heading a link
$$("body:not([mv-app]) > section > h1, body:not([mv-app]) > section section > h1").forEach(function (h1) {
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

(function(){
	var index = $("#contents ul");

	if (index) {
		document.documentElement.classList.add("has-contents");

		$.create("a", {
			href: "#contents",
			textContent: "☰",
			title: "Jump to table of contents",
			className: "to-contents",
			inside: $("body > h2")
		});
	}

	// Build Table Of Contents for current page
	if (index && !document.body.classList.contains("no-toc")) {
		var tocUl = $("ul#toc");

		if (!tocUl) {
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

			tocUl = $.create("ul", {
				contents: toc
			});
		}

		for (var a of $$("li > a", index)) {
			if (a.pathname.replace(/\/$/, "") === location.pathname.replace(/\/$/, "")) {
				var currentPage = a.parentNode;
				break;
			}
		}

		currentPage = currentPage || $.create("li", {
			className: "current",
			start: index,
			contents: {
				tag: "a",
				textContent: "On This Page"
			}
		});

		currentPage.classList.add("current");
		currentPage.appendChild(tocUl);
	}
})();

})(Bliss, Bliss.$)
