var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    merge = require('merge-stream'),
    concat = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    shell = require('gulp-shell'),
    argv = require('yargs').argv,

    // Paths
    srcPath = './',
    destPath = 'C://xampp/htdocs/websm/application/themes/websm',

    // Configuration
    minified = false;


gulp.task('minify', function () {
    minified = true;
});

gulp.task('server', function(){
    var action, parameters;

    if (argv.start !== undefined || argv.stop !== undefined) {
        action = (argv.start !== undefined) ? 'start' : 'stop';
        parameters = (argv.start !== undefined) ? './ -p 8090 -c-1 -d false' : '';
        return gulp.src('').pipe(shell('"./node_modules/.bin/forever" '+action+' "./node_modules/http-server/bin/http-server" '+parameters));
    }else{
        console.log('**Invalid action \nPlease use  gulp server (--start\|--stop)');
    }
});

gulp.task('bower', shell.task([
    'node "./node_modules/bower/bin/bower" install'
]));

gulp.task('css', function () {
    var minified = false;
    return gulp.src(['sass/screen.scss'])
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulpif(minified, cssmin()))
        .pipe(gulp.dest('css'));
});

gulp.task('sync', function() {
    gulp.src(['*.php', 'description.txt', 'thumbnail.png'])
        .pipe(gulp.dest(destPath))
    gulp.src(['css/*.css'])
        .pipe(gulp.dest(destPath+'/css/'))
    gulp.src('js/*.js')
        .pipe(gulp.dest(destPath+'/js/'))
});

gulp.task('build', ['css', 'sync']);

gulp.task('default', ['build']);