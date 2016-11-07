/*
Build file to concat & minify files, compile SCSS and so on.
*/
// grab our gulp packages
var gulp  = require("gulp");
var gutil = require("gulp-util");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var babel = require("gulp-babel");
var autoprefixer = require("gulp-autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var fileinclude = require("gulp-file-include");
var notify = require("gulp-notify");

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
		.pipe(notify("<%= file.relative %> done!"));
});

gulp.task("update", function() {
	gulp.src(["../mavo/dist/**/*"]).pipe(gulp.dest("mavo"));
});

gulp.task("html", function() {
	gulp.src(["**/*.tpl.html"])
		.pipe(fileinclude({
			basepath: "templates/"
		}))
		.pipe(rename({ extname: "" }))
		.pipe(rename({ extname: ".html" }))
		.pipe(gulp.dest("."));
});

gulp.task("watch", function() {
	gulp.watch(["../mavo/dist/*"], ["update"]);
	gulp.watch(["**/*.scss"], ["sass"]);
	gulp.watch(["**/*.tpl.html", "./templates/*.html"], ["html"]);
});

gulp.task("default", ["update", "sass"]);
