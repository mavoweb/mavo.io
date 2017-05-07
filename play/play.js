tinymce.init({
	selector: "textarea",
	toolbar1: "styleselect | bold italic | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
	toolbar2: "image link | table | visualblocks mavoapp mavoproperty mavomultiple",
	plugins: "visualblocks image code link table charmap colorpicker lists media tabfocus textcolor",
	//menubar: "file edit insert view format table tools",
	//extended_valid_elements: "*[mv-storage|property|itemprop|mv-multiple]",
	valid_elements: "*[*]",
	visualblocks_default_state: true,
	setup: function (editor) {
		editor.addButton("mavoapp", {
			text: "Mavo app",
			icon: false,
			onclick: function () {
				var node = editor.selection.getNode();
				node = node.closest("[mv-storage]") || node.closest("body > *") || node;
				node.setAttribute("mv-storage", prompt("Where to store data?", "local"));

				update();

				nodeChange(editor.selection.getNode());
			}
		});

		var propertyButton;
		editor.addButton("mavoproperty", {
			text: "Property",
			icon: false,
			disabled: true,
			onclick: function () {
				editor.selection.getNode().setAttribute("property", prompt("Property name?", "thing"));
				update();
			},
			onPostRender : function() { propertyButton = this; }
		});

		function nodeChange(element) {
			requestAnimationFrame(() => {
				var mavo = element.matches("[mv-storage], [mv-storage] *");

				propertyButton && propertyButton.disabled(!mavo || element.children.length > 0);

				multipleButton && multipleButton.disabled(!mavo);
			})

		}

		editor.on("NodeChange", function(event) {
			nodeChange(event.element);
		});

		var multipleButton;
		editor.addButton("mavomultiple", {
			text: "Multiple",
			icon: false,
			disabled: true,
			onclick: function () {
				var node = editor.selection.getNode();
				node.setAttribute("mv-multiple", "");

				if (!node.hasAttribute("property")) {
					node.setAttribute("property", prompt("Property name?", "thing"));
				}

				update();
			},
			onPostRender : function() { multipleButton = this; }
		});

		function update() {
			result.removeAttribute("srcdoc");
			result.setAttribute("srcdoc", `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" />
<title>Mavo</title>
<link rel="stylesheet" href="https://get.mavo.io/mavo.css" />
</head>
<body>${editor.getContent({format: 'raw'})}
<script src="https://get.mavo.io/mavo.js"></script>
</body>
</html>`);
		}

		editor.on("setAttrib input init", evt => {
			update();
		});
	},
	content_css: [
		"editor.css"
	]
});
