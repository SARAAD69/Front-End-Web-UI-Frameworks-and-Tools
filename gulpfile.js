const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

var del = require('del'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    rev = require('gulp-rev'),
    cleanCss = require('gulp-clean-css'),
    flatmap = require('gulp-flatmap'),
    htmlmin = require('gulp-htmlmin');

function style() {
    return gulp.src('./css/*.scss')
          .pipe(sass().on('error', sass.logError))
          .pipe(gulp.dest('./css'))
          .pipe(browserSync.stream());
    
} 

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
         }
    });
    gulp.watch('./css/*.scss', style)
    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('./img/*.{png,jpg,gif}');
    gulp.watch('./js/*.js').on('change', browserSync.reload);;
}

exports.style = style;
exports.watch = watch;

// Clean
gulp.task('clean', function() {
    return del(['dist']);
});

gulp.task('copyfonts', async function() {
   gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
   .pipe(gulp.dest('./dist/fonts'));
});
// Images
gulp.task('imagemin', function() {
    return gulp.src('img/*.{png,jpg,gif}')
      .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
      .pipe(gulp.dest('dist/img'));
  });

  gulp.task('usemin', function() {
    return gulp.src('./*.html')
    .pipe(flatmap(function(stream, file){
        return stream
          .pipe(usemin({
              css: [ rev() ],
              html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
              js: [ uglify(), rev() ],
              inlinejs: [ uglify() ],
              inlinecss: [ cleanCss(), 'concat' ]
          }))
      }))
      .pipe(gulp.dest('dist/'));
  });
  
  

  gulp.task('build',
  gulp.series('clean', gulp.parallel('copyfonts','imagemin','usemin')));