import gulp from 'gulp'; // Gulp: 작업 자동화 도구
import fileInclude from 'gulp-file-include'; // gulp-file-include: HTML 파일 포함 플러그인
import dartSass from 'sass'; // sass: Dart Sass 컴파일러
import gulpSass from 'gulp-sass'; // gulp-sass: Gulp용 Sass 컴파일러
import sourcemaps from 'gulp-sourcemaps'; // gulp-sourcemaps: 소스 맵 생성 플러그인
import concat from 'gulp-concat'; // gulp-concat: 파일 병합 플러그인
import autoprefixer from 'gulp-autoprefixer'; // gulp-autoprefixer: CSS 자동 접두사 추가 플러그인
import browserSyncPkg from 'browser-sync'; // browser-sync: 브라우저 동기화 및 라이브 리로드 도구
import { deleteAsync } from 'del'; // del: 파일 및 디렉토리 삭제 도구


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
      cascade: false // CSS 스타일 유지
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/resources/css')); // 원본 디렉토리 구조 유지
};

// JavaScript Concatenate
export const js = () => {
  return gulp.src('./src/js/**/*.js')
    .pipe(concat('scripts.js')) // JS 파일 병합
    .pipe(gulp.dest('./dist/resources/js'));
};

// Clean Dist Folder (강제 삭제 옵션 추가)
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
};


// Default Task
export default gulp.series(clean, gulp.parallel(html, scss, js), serve); // clean을 먼저 실행하고, 나머지는 병렬로 실행한 후 serve 실행