/*
Build file to concat & minify files, compile SCSS and so on.
*/
// grab our gulp packages
var gulp  = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var fileinclude = require("gulp-file-include");
var notify = require("gulp-notify");
var replace = require("gulp-replace");

gulp.task("sass", function() {
	return gulp.src(["**/*.scss", "!node_modules/**"])
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer({
			browsers: ["last 2 versions"],
			cascade: false
		}))
		.pipe(rename({ extname: ".css" }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest("."))
		.pipe(notify({
			message: "Sass done!",
			onLast: true
		}));
});

gulp.task("html", function() {
	gulp.src(["**/*.tpl.html"])
		.pipe(fileinclude({
			basepath: "templates/"
		}).on("error", function(error) {
			console.error(error);
		}))
		.pipe(rename({ extname: "" }))
		.pipe(rename({ extname: ".html" }))
		.pipe(gulp.dest("."))
		.pipe(notify({
			message: "HTML done!",
			onLast: true
		}));
});

gulp.task("study", function() {
	gulp.src(["studies/uist2018/*/index.html", "!studies/uist2018/people/index.html"], { base: "./" })
		.pipe(replace(/ mv-action=".+?"/g, ""))
		.pipe(rename({ suffix: "-start" }))
		.pipe(gulp.dest("."));
});

gulp.task("watch", function() {
	gulp.watch(["**/*.scss"], ["sass"]);
	gulp.watch(["**/*.tpl.html", "./templates/*.html"], ["html"]);
	gulp.watch(["studies/uist2018/*/index.html", "!studies/uist2018/people/index.html"], ["study"]);
});

gulp.task("default", ["sass", "html"]);
