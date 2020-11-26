const
    gulp = require("gulp"),
    browserSync = require("browser-sync").create(),
    watch = require("gulp-watch"),
    sass = require("gulp-sass"),
    autoPrefix = require("gulp-autoprefixer"),
    sourcemaps = require("gulp-sourcemaps"),
    notify = require("gulp-notify"),
    plumber = require("gulp-plumber"),
    fileInclude = require("gulp-file-include"),
    rename = require("gulp-rename"),
    minify = require("gulp-minify"),
    concat = require('gulp-concat');

gulp.task("jsComp", function () {
    return gulp.src("./develop/js/*")
        .pipe(gulp.dest("./public/js/"));
});

gulp.task("html", function () {
    return gulp.src("./develop/index.html")
        .pipe(plumber({
            errorHandler: notify.onError(function (err) {
                return {
                    title: "HTML Include",
                    sound: true,
                    message: err.message
                }
            })
        }))
        .pipe(fileInclude({
            prefix: "@@"
        }))
        .pipe(gulp.dest("./public/"));
});

gulp.task("scssComp", function () {
    return gulp.src("./develop/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(autoPrefix({
            overrideBrowserslist: ["last 4 versions"]
        }))
        .pipe(sourcemaps.write())
        .pipe( gulp.dest("./public/css/"));
});

gulp.task("watch", function () {
    watch(["./public/*.html", "./public/css/**/*.css", "./public/js/**/*.js"], gulp.parallel( browserSync.reload ));
    watch("./develop/**/*.scss", gulp.parallel("scssComp"));
    watch("./develop/js/**/*.js", gulp.parallel("jsComp"));
    watch("./develop/*.html", gulp.parallel("html"));
});

gulp.task("server", function () {
    browserSync.init({
        server: {
            baseDir: "./public/"
        }
    })
});

gulp.task("default", gulp.parallel("server", "watch", "scssComp", "html", "jsComp"));