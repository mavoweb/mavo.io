/*
Build file to concat & minify files, compile SCSS and so on.
npm install gulp gulp-util gulp-uglify gulp-rename gulp-concat gulp-sourcemaps gulp-babel gulp-sass gulp-autoprefixer --save-dev
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
		.pipe(gulp.dest("."));
});

gulp.task("update", function() {
	gulp.src(["../mavo/build/*"]).pipe(gulp.dest("mavo"));
});

gulp.task("watch", function() {
	gulp.watch(["../mavo/build/*"], ["update"]);
	gulp.watch(["**/*.scss"], ["sass"]);
});

gulp.task("default", ["update", "sass"]);
