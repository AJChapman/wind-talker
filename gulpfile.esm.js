import gulp from "gulp";
import ts from "gulp-typescript";
import browserify from "browserify";
import babelify from "babelify";
import watchify from "watchify";
import source from "vinyl-source-stream";
import fancy_log from "fancy-log";
import sourcemaps from "gulp-sourcemaps";
import buffer from "vinyl-buffer";
import del from "del";
import fs from "fs";

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
        src: 'ts-out',
        entries: 'ts-out/main.js',
        dest: 'dist/'
    }
};

export const clean = () =>
  del([paths.pages.dest, paths.typescripts.dest]);

export function pages() {
    return gulp.src(paths.pages.src)
      .pipe(gulp.dest(paths.pages.dest));
}

var tsProject = ts.createProject('tsconfig.json');

export function typescripts() {
    return gulp.src(paths.typescripts.src)
      .pipe(tsProject())
      .pipe(gulp.dest(paths.typescripts.dest));
}

var plainBrowserify = browserify({
        entries: paths.scripts.entries,
        debug: true,
    });

var watchedBrowserify = browserify({
        entries: paths.scripts.entries,
        debug: true,
        cache: {},
        packageCache: {},
        plugin: [watchify]
    });

function doScripts(b) {
    return b
      .transform(babelify, {
          global: true,
          only: [
              paths.scripts.src,
              /\/node_modules\/d3-.*\//,
              /\/node_modules\/internmap\//,
          ],
          presets: [
            [
              "@babel/preset-env",
              {
                "corejs": 3,
                "useBuiltIns": "usage"
              }
            ]
          ]
        })
      .bundle()
      .on("error", fancy_log)
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(paths.scripts.dest));
}

function scripts() {
    return doScripts(plainBrowserify);
}

function watchedScripts() {
    return doScripts(watchedBrowserify);
}

function watchFiles() {
    gulp.watch(paths.pages.src, pages);
    gulp.watch(paths.typescripts.src, typescripts);
    watchedBrowserify.on("update", watchedScripts);
    watchedBrowserify.on("log", fancy_log);
    gulp.parallel(pages, gulp.series(typescripts, watchedScripts));
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(pages, gulp.series(typescripts, scripts)));

export default build;
