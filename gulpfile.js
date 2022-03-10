var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var watchify = require("watchify");
var tsify = require("tsify");
var fancy_log = require("fancy-log");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var paths = {
    pages: ["src/*.html"]
};

gulp.task("copy-html", function() {
    return gulp.src(paths.pages).pipe(gulp.dest("dist"));
});

var browserTsify = browserify({
        basedir: ".",
        debug: true,
        entries: ["src/main.ts"],
        cache: {},
        packageCache: {},
    })
    .plugin(tsify);

var watchedBrowserify = watchify(browserTsify);

function bundle() {
    //return watchedBrowserify
    return browserTsify
      .transform("babelify", {
          global: true,
          ignore: [/\/node_modules\/(?!d3\/)/, /\/node_modules\/(?!d3-delaunay\/)/, /\/node_modules\/(?!internmap\/)/],
          presets: [
              "@babel/preset-typescript",
              [
                  "@babel/preset-env",
                  {
                      "targets": {
                          "edge": "17",
                          "firefox": "60",
                          "chrome": "67",
                          "safari": "11.1"
                      },
                      "useBuiltIns": "usage",
                      "corejs": "3.21.1"
                  }
                ]
            ],
          extensions: [".ts", ".js"],
      })
      .bundle()
      .on("error", fancy_log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist"));
}

gulp.task("default", gulp.series(gulp.parallel("copy-html"), bundle));
//watchedBrowserify.on("update", bundle);
//watchedBrowserify.on("log", fancy_log);