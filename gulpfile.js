var gulp = require('gulp'),
	sass = require('gulp-sass'),
	prefix = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	livereload = require("gulp-livereload"),
	size = require('gulp-filesize'),
	cache = require('gulp-cache'),
	notify = require("gulp-notify"),
	gulpFilter = require('gulp-filter'),
	include = require('gulp-include'),
	svgstore = require('gulp-svgstore'),
	svgmin = require('gulp-svgmin'),
	rename = require("gulp-rename"),
	svg2png = require('gulp-svg2png'),
	inject = require('gulp-inject'),
	cheerio = require('gulp-cheerio');


// CREATE SVG SPRITE
gulp.task('sprites', function () {
    return gulp.src('assets/src/img/svg/*.svg')
        .pipe(svgmin())
        .pipe(cheerio({
        	run: function ($) {
                $('[fill]').removeAttr('fill');
            },
            parserOptions: { xmlMode: true }
        }))
	    .pipe(svgstore({ 
	    	fileName: 'icons.svg', 
	    	prefix: 'icon-'
         }))
	    .pipe(gulp.dest('assets/dist/img'));
});

// CONVERT SVGS TO PNGS
gulp.task('svg2png', function () {
    gulp.src('assets/src/img/svg/*.svg')
        .pipe(svg2png())
        .pipe(rename({
        	prefix: "icons.svg.icon-"
        }))
        .pipe(gulp.dest('assets/dist/img'));
});



// HANDLE SASS
gulp.task('styles', function() {
	gulp.src('assets/src/scss/main.scss')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sass({
			includePaths: ['bower_components/foundation/scss']
		}) )
		.pipe(prefix("last 2 versions"))
		.pipe(minifyCSS())
		.pipe(gulp.dest('assets/dist/css'))
		.pipe(size())
		.pipe(notify("SASS finished compiling"));
});

// IE9
gulp.task('ie9', function() {
	gulp.src('assets/src/scss/ie9.scss')
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sass())
		.pipe(minifyCSS())
		.pipe(gulp.dest('assets/dist/css/'));
});

// HANDLE JS
gulp.task('scripts', function() {
  	gulp.src('assets/src/js/*')
  		.pipe( plumber() )
  		.pipe( include() )	// allows us to include javascript files like sprockets
    	.pipe( concat('production.js') )
    	.pipe(uglify())
    	.pipe(gulp.dest('assets/dist/js'))
    	.pipe(size())
    	.pipe(notify("JS finished compiling"));;
});

gulp.task('jsControllers', function() {
    gulp.src('assets/src/js/controllers/*.js')
	    .pipe( plumber() )
  		.pipe( include() )	// allows us to include javascript files like sprockets
        // .pipe( uglify() )
        .pipe(gulp.dest( 'assets/dist/js/controllers/' ) );
});


// IMAGE MIN
gulp.task('img', function () {
	var filter = gulpFilter(['*', '!placeholder-**']);

  	gulp.src('assets/src/img/*')
  		.pipe(filter)
		.pipe(cache(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			optimizationLevel: 3,
			interlaced: true,
			src: ['**/*.{png,jpg,gif}'],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('assets/dist/img/'));
});


// CLEAR CACHE
gulp.task('clear', function (done) {
    return cache.clearAll(done);
});


// WATCH
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('assets/src/scss/**/*.scss', ['styles']);

    // IE
    // gulp.watch('assets/src/scss/ie8.scss', ['ie8']);
    // gulp.watch('assets/src/scss/ie9.scss', ['ie9']);

    // Watch .js files
    gulp.watch('assets/src/js/**/*.js', ['scripts', 'jsControllers']);

    // Watch image files
    gulp.watch('assets/src/img/*', ['img']);

    // Create LiveReload server
    var server = livereload();

    // Watch any files in dist/, reload on change
    gulp.watch(['assets/dist/**']).on('change', function(file) {
	    server.changed(file.path);
    });
});


gulp.task('default', function() {
	gulp.start('sprites', 'styles', 'ie9', 'scripts', 'jsControllers', 'img', 'watch', 'clear');
});

