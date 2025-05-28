// gulpfile.js
const gulp = require("gulp");
const fileInclude = require("gulp-file-include");

gulp.task("build-html", () => {
  return gulp
    .src("src/node.html")
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(gulp.dest("./")); // Output node.html to project root
});
