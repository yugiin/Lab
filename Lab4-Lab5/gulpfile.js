var gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    concat       = require('gulp-concat'), 
	uglify       = require('gulp-uglifyjs'),
	cssnano     = require('gulp-cssnano'), 
    rename      = require('gulp-rename'),
    imagemin    = require('gulp-imagemin'), 
    pngquant    = require('imagemin-pngquant'),
    autoprefixer = require('gulp-autoprefixer'); 

gulp.task('less', function () {
  return gulp.src('app/less/**/*.less')
    .pipe(less())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true})) 
});

gulp.task('browser-sync', function() { 
    browserSync({ 
        server: { 
            baseDir: 'app' 
        },
        notify: false 
    });
});

gulp.task('scripts', function() {
	return gulp.src([ 
		'app/js/jquery1_12_4.min.js', 
		'app/libs/bootstrap/js/bootstrap.min.js', 
		'app/js/jPages.min.js',
		'app/js/validator.min.js',
		'app/js/script.js' 
		])
		.pipe(concat('libs.min.js')) 
		.pipe(uglify()) 
		.pipe(gulp.dest('app/js')); 
});

gulp.task('css-libs', ['less'], function() {
    return gulp.src('app/css/css.css') 
        .pipe(cssnano()) 
        .pipe(rename({suffix: '.min'})) 
        .pipe(gulp.dest('app/css')); 
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/less/**/*.less', ['less']); 
    gulp.watch('app/*.html', browserSync.reload); 
    gulp.watch('app/js/**/*.js', browserSync.reload);   
});


gulp.task('img', function() {
    return gulp.src('app/img/**/*') 
        .pipe(imagemin({ 
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img')); 
});

gulp.task('build', ['img','less', 'scripts'], function() {

    var buildCss = gulp.src([
        'app/css/css.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

     var buildJs = gulp.src('app/**/*.json') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});


gulp.task('default', ['watch']);