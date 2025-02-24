import gulp from 'gulp';
import fileInclude from 'gulp-file-include';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import autoprefixer from 'gulp-autoprefixer';
import browserSyncPkg from 'browser-sync';
import { deleteAsync } from 'del';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';

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

// SCSS to CSS, Autoprefix, without Concatenate
export const scss = () => {
  return gulp.src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/resources/css'));
};

// JavaScript Concatenate
export const js = () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./dist/resources/js'));
};

// Image Optimization (CommonJS 방식에서 ESM 방식으로 변경)
export const images = async () => {
  await imagemin(['src/images/*.{jpg,png,gif,svg}'], {
    destination: 'dist/resources/images',
    plugins: [
      imageminMozjpeg({ quality: 75, progressive: true }),
      imageminPngquant({ quality: [0.6, 0.8] }),
      imageminGifsicle({ interlaced: true }),
      imageminSvgo({ plugins: [{ removeViewBox: false }] })
    ]
  });
};

// Clean Dist Folder
export const clean = () => {
  return deleteAsync(['./dist'], { force: true });
};

// Serve with Live Reload
export const serve = () => {
  browserSync.init({
    server: { baseDir: './dist' }
  });

  gulp.watch('./src/scss/**/*.scss', gulp.series(scss)).on('change', browserSync.reload);
  gulp.watch('./src/**/*.html', gulp.series(html)).on('change', browserSync.reload);
  gulp.watch('./src/js/**/*.js', gulp.series(js)).on('change', browserSync.reload);
  gulp.watch('./src/images/**/*', gulp.series(images)).on('change', browserSync.reload);
};

// Default Task
export default gulp.series(clean, gulp.parallel(html, scss, js, images), serve);
