var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var order = require('gulp-order');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var karma = require('karma');

var QMLParserSources = [
  'src/helpers/encapsulate.begin.js',
  'src/qtcore/qml/QMLBinding.js',

  'src/uglify/ast.js',
  'src/uglify/parse.js',
  'src/uglify/utils.js',

  'src/qtcore/qml/lib/parser.js',
  'src/qtcore/qml/lib/process.js',
  'src/qtcore/qml/lib/import.js',

  'src/qtcore/*.js',
  'src/qtcore/qml/qml.js',
  'src/qtcore/qml/**/*.js',

  'src/qmlweb/**/*.js',
  'src/helpers/encapsulate.end.js'
];

var QMLRunTimeSources = [
  'src/helpers/encapsulate.begin.js',
  'src/runtime/$.js',
  'src/runtime/main.js',
  'src/runtime/**/*.js',
  'src/helpers/encapsulate.end.js'
];

var QML2JSSources = QMLParserSources.concat(QMLRunTimeSources);

var tests = [
  'tests/**/*.js'
];
var outputDEST = './build';

gulp.task('build-parser-dev', function() {
  return gulp.src(QMLParserSources)
    .pipe(order(QMLParserSources, {
      base: __dirname
    }))
    .pipe(concat('qml2js-parser.js'))
    .pipe(changed(outputDEST))
    .pipe(gulp.dest(outputDEST));
});

gulp.task('build-parser', ['build-parser-dev'], function() {
  return gulp.src(outputDEST + '/qml2js-parser.js')
    .pipe(rename('qml2js-parser.min.js'))
    .pipe(changed(outputDEST))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outputDEST));
});

gulp.task('build-runtime-dev', function() {
  return gulp.src(QMLRunTimeSources)
    .pipe(order(QMLRunTimeSources, {
      base: __dirname
    }))
    .pipe(concat('qml2js-runtime.js'))
    .pipe(changed(outputDEST))
    .pipe(gulp.dest(outputDEST));
});

gulp.task('build-runtime', ['build-runtime-dev'], function() {
  return gulp.src(outputDEST + '/qml2js-runtime.js')
    .pipe(rename('qml2js-runtime.min.js'))
    .pipe(changed(outputDEST))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outputDEST));
});

gulp.task('build-dev', ['build-parser-dev', 'build-runtime-dev'], function() {
  return gulp.src([
      outputDEST + '/qml2js-parser.js',
      outputDEST + '/qml2js-runtime.js'
    ])
    .pipe(concat('qml2js-all.js'))
    .pipe(changed(outputDEST))
    .pipe(gulp.dest(outputDEST));
});

gulp.task('build', ['build-parser', 'build-runtime', 'build-dev'], function() {
  return gulp.src([
      outputDEST + '/qml2js-parser.min.js',
      outputDEST + '/qml2js-runtime.min.js'
    ])
    .pipe(concat('qml2js-all.min.js'))
    .pipe(changed(outputDEST))
    .pipe(gulp.dest(outputDEST));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(QML2JSSources, ['build']);
});

gulp.task('watch-dev', ['build-dev'], function() {
  gulp.watch(QML2JSSources, ['build-dev']);
});

gulp.task('lint-tests', function() {
  gulp.src(tests)
    .pipe(eslint())
    .pipe(eslint.formatEach('compact', process.stderr))
    .pipe(eslint.failAfterError());
});

gulp.task('lint', ['lint-tests']);

gulp.task('test', ['lint', 'build'], function(done) {
  new karma.Server({
    singleRun: true,
    configFile: __dirname + '/karma.conf.js'
  }, function(code) {
    process.exit(code);
  }).start();
});

gulp.task('test-watch', ['watch-dev'], function(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

gulp.task('test-debug', ['watch-dev'], function(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    browsers: ['PhantomJSCustom', 'Chrome'],
    preprocessors: {},
    reporters: ['progress'],
    debug: true
  }, done).start();
});

gulp.task('default', ['watch']);