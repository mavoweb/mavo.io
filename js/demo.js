Mavo.load("/sitewide.js");

if (!parent || parent === window) {
	$.ready().then(function(){
		var id = Mavo.Functions.url("demos");
		Mavo.load("/css/prism.css");
		Mavo.load("/demos/style.css");

		var buttons = {};
		var bar = $.create({
			className: "demo-bar",
			contents: [
				{
					tag: "a",
					textContent: "🏠",
					title: "All Demos",
					href: "/demos",
					className: "home"
				},
				{
					tag: "a",
					textContent: "◂",
					title: "Previous",
					className: "previous"
				},
				{
					tag: "button",
					textContent: "HTML",
					className: "html"
				},
				{
					tag: "a",
					download: id + ".zip",
					textContent: "Download",
					href: id + ".zip",
					className: "download"
				},
				{
					tag: "a",
					textContent: "▸",
					title: "Next",
					className: "next"
				},
				{
					tag: "button",
					textContent: "×",
					title: "Close",
					className: "close",
					events: {
						click: e => bar.remove()
					}
				}
			].map(o => buttons[o.className] = $.create(o)),
			start: document.body
		});

		$.fetch("/demos/demos.json", {responseType: "json"}).then(xhr => {
			var demos = xhr.response.demo;
			var ids = demos.map(demo => demo.id);
			var index = ids.indexOf(id);
			var previous = ids[index - 1];
			var next = ids[index + 1];

			if (previous) {
				buttons.previous.href = "/demos/" + previous;
				buttons.previous.title += ` (${index} of ${ids.length})`;
			}

			if (next) {
				buttons.next.href = "/demos/" + next;
				buttons.next.title += ` (${index + 2} of ${ids.length})`;
			}
		})

		document.body.classList.add("has-demo-bar");

		$.fetch(location.href).then(xhr => {
			var html = xhr.responseText
				.replace(/data-files=".+?" /, "")
				.replace('<script src="/js/demo.js"></script>\n', "");

			// Create HTML tooltips
			Promise.all([
				$.include(self.Prism, "/js/prism.js"),
				$.include(self.tippy, "https://unpkg.com/tippy.js@2/dist/tippy.js")
			])
			.then(() => {
				var t = tippy(buttons.html, {
					html: () => {
						var pre = $.create("pre")
						var code = $.create("code", {
							textContent: html,
							className: "language-markup",
							inside: pre
						});

						Prism.highlightElement(code);

						return pre;
					},
					arrow: true,
					theme: "light",
					trigger: "click",
					interactive: true,
					maxWidth: "80vw",
					animation: "scale",
					inertia: true,
					placement: "bottom"
				});

				Mavo.load("https://unpkg.com/tippy.js@2/dist/tippy.css");
			});

			// Create zip download
			$.include("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.5/jszip.min.js").then(() => {
				buttons.download.onclick = function(evt) {
					var zip = new JSZip();
					zip.file("index.html", html);
					zip.file("style.css", $.fetch("style.css").then(xhr => xhr.responseText));
					zip.file(id + ".url", `[InternetShortcut]
URL=https://mavo.io/demos/${id}`);

					var files = document.documentElement.getAttribute("data-files");

					if (files) {
						var binaryExtensions = ["woff", "png", "jpg", "gif"];

						files.trim().split(/\s+/).forEach(file => {
							var ext = Mavo.Functions.from(file, ".");
							isBinary = binaryExtensions.indexOf(ext) > -1;
							console.log(ext, isBinary);
							zip.file(file, $.fetch(file, isBinary? {responseType: "arraybuffer"} : undefined).then(xhr => xhr.response));
						});
					}

					zip.generateAsync({type:"blob"}).then(function(blob) {
						buttons.download.href = URL.createObjectURL(blob);
						buttons.download.onclick = null;
						buttons.download.click();
					});

					evt.preventDefault();
				}

			});
		})




	});
}
