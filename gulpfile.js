var gulp = require("gulp");
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var fancy_log = require("fancy-log");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");
var del = require("del");

var paths = {
    pages: {
        src: ["src/*.html"],
        dest: 'dist/'
    },
    typescripts: {
        src: 'src/**/*.ts',
        dest: 'ts-out/'
    },
    scripts: {
        entries: 'ts-out/main.js',
        dest: 'dist/'
    }
};

function clean() {
    del([paths.pages.dest, paths.typescripts.dest]);
}

function pages() {
    return gulp.src(paths.pages.src).pipe(gulp.dest(paths.pages.dest));
}

function typescripts() {
    const tsconfig = require('./tsconfig.json');
    gulp.src(paths.typescripts.src)
      .pipe(ts(tsconfig.compilerOptions))
      .pipe(gulp.dest(paths.typescripts.dest));
}

function scripts() {
    const babelconfig = require('./babel.config.json');
    return browserify({
        entries: paths.scripts.entries,
        debug: false,
    }).transform(babelify.configure(babelconfig))
      .bundle()
      .on("error", fancy_log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(paths.scripts.dest));
}

var build = gulp.series(clean, gulp.parallel(pages, gulp.series(typescripts, scripts)));

function watch() {
    gulp.watch(paths.pages.src);
    gulp.watch(paths.typescripts.src);
}

exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
