/*
 ** As a developer, I should be able to run the npm install command to install all of the dependencies for the build process.
 *
*/

'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    csso = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    del = require('del'),
    useref = require('gulp-useref'),
    iff = require('gulp-if'),
    sequence = require('run-sequence'),
    eslint = require('gulp-eslint');

var options = {
    src : 'src',
    dist : 'dist'
}

// As a developer, I should be able to run the gulp scripts command at the command line to concatenate,
// minify, and copy all of the project’s JavaScript files into an all.min.js file that is then copied to the dist/scripts folder.

// As a developer, when I run the gulp scripts or gulp styles commands at the command line, source maps are generated
// for the JavaScript...
gulp.task('scripts', ['lint'], () => {
    return gulp.src('./js/**/*.js')
        .pipe(maps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist + '/scripts'))
});

// As a developer, when I run the gulp scripts command at the command line, all of my project’s JavaScript files will be
// linted using ESLint and if there’s an error, the error will output to the console and the build process will be halted.
gulp.task('lint', () => {
    return gulp.src('./js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
})


// As a developer, I should be able to run the gulp styles command at the command line to compile the project’s
// SCSS files into CSS, then concatenate and minify into an all.min.css file that is then copied to the dist/styles folder.

// ... and CSS files respectively.
gulp.task('styles', () => {
    return gulp.src('./sass/**/*.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(concat('all.min.css'))
        .pipe(csso())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist + '/styles'))
});


// As a developer, I should be able to run the gulp images command at the command line to optimize the size of the project’s
// JPEG and PNG files, and then copy those optimized images to the dist/content folder.
gulp.task('images', () => {
    return gulp.src('./images/**/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest(options.dist + '/content'))
});

gulp.task('compileSass', () => {
    return gulp.src('./sass/**/*.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest('css'));})

gulp.task('html', ['compileSass'], () => {
    gulp.src('index.html')
        .pipe(useref('index.html'))
        .pipe(iff('*.js', uglify()))
        .pipe(iff('*.css', csso()))
        .pipe(gulp.dest(options.dist));
})

// As a developer, I should be able to run the gulp clean command at the command line to delete
// all of the files and folders in the dist folder.
gulp.task('clean', () => {
    del('dist');
});

// As a developer, when I run the gulp watch command, the scripts task should run and the current page should be
// reloaded in the browser when a change is made to any JavaScript (*.js) file.
gulp.task('watch', ['serve'], () => {
    gulp.watch('./js/**/*.js', ['scripts', 'reload']);
});

// Reload is added as a dependency to the watch task in order to avoid livereload error: WebSocket connection to 'ws://localhost:35729/livereload' failed
gulp.task('reload', () => {
    gulp.src('./js/**/*.js')
        .pipe(connect.reload());
});

// As a developer, I should be able to run the gulp serve command on the command line to build and serve the project
// using a local web server.
gulp.task('serve', ['build'], () => {
    connect.server({
        root : 'dist',
        livereload : true,
        port: 3000
    })
});

// Copy icons folder to dist folder when gulp build runs
gulp.task('copy', () => {
    gulp.src('icons/**')
        .pipe(gulp.dest(options.dist + '/icons'))
});

// As a developer, I should be able to run the gulp build command at the command line to run the clean,
// scripts, styles, and images tasks with confidence that the clean task completes before the other commands.
gulp.task('build', ['clean'], () => {
    return sequence('html', 'copy', 'images')
});

// As a developer, I should be able to run the gulp command at the command line to run the “build” task.
gulp.task('default', ['build'], () => {
    console.log('Gulp...gulp...gulp');
});