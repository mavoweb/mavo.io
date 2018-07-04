fetch("../demos.json").then(r => r.json()).then(demos => {
	var media = demos.demo.map(d => `../${d.id}/video.mp4`);
	media.splice(1, 0, "todo-code.png");

	for (var i=3; i<media.length; i+=3) {
		media.splice(i, 0, "mavo.svg");
	}

	playVideo(0, media);
});


function playVideo(i, media) {
	if (i >= media.length) {
		i = 0;
	}

	var then = () => playVideo(++i, media);

	if (!/\.mp4$/.test(media[i])) {
		// Image, not video
		img.src = media[i];
		video.removeAttribute("src");
		setTimeout(then, 4000);
	}
	else {
		video.src = media[i];
		video.play();
		img.removeAttribute("src");
		video.addEventListener("ended", then, {once: true});
	}


}
