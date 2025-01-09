import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import browserSyncPkg from 'browser-sync';

const browserSync = browserSyncPkg.create();
const sass = gulpSass(dartSass);

// HTML Include
export const html = () => {
  return gulp.src('./src/**/*.html')
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'));
};

// SCSS to CSS, Autoprefix, and Concatenate
export const scss = () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false // CSS 스타일 유지
    }))
    .pipe(concat('styles.css')) // SCSS 파일 병합
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));
};

// JavaScript Concatenate
export const js = () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(concat('scripts.js')) // JS 파일 병합
    .pipe(gulp.dest('./dist/js'));
};

// Serve with Live Reload
export const serve = () => {
  browserSync.init({
    server: { baseDir: './dist' }
  });

  gulp.watch('./src/scss/**/*.scss', gulp.series(scss)).on('change', browserSync.reload);
  gulp.watch('./src/**/*.html', gulp.series(html)).on('change', browserSync.reload);
  gulp.watch('./src/js/**/*.js', gulp.series(js)).on('change', browserSync.reload);
};

// Default Task
export default gulp.series(html, scss, js, serve);
