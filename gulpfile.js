const browserify = require('gulp-browserify');
const connect = require('gulp-connect');
const cssimport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const paths = require('./src/config/paths');

const { join } = require('path');

gulp.task('connect', () =>
  connect.server({
    root: '.',
    livereload: true,
  })
);

gulp.task('scripts', () =>
  gulp
    .src(join(paths.scriptsSrc, 'main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(paths.scriptsDest))
    .pipe(connect.reload())
);

gulp.task('styles', () =>
  gulp
    .src(join(paths.stylesSrc, 'main.css'))
    .pipe(postcss([
      cssimport({ path: './src' }),
      cssnext({ browsers: ['last 2 chrome versions', 'last 2 ff versions'] }),
    ]))
    .pipe(gulp.dest(paths.stylesDest))
    .pipe(connect.reload())
);

gulp.task('watch', () => {
  gulp.watch(join(paths.src, '**/*.js'), ['scripts']);
  gulp.watch(join(paths.src, '**/*.css'), ['styles']);
});

gulp.task('default', ['scripts', 'styles']);

gulp.task('dev', ['default', 'connect', 'watch']);
