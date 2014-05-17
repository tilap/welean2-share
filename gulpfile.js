var gulp = require('gulp');
var child_process = require('child_process');
var daemon = require('springbokjs-daemon').node([ 'src/server/server.js' ]);
var less = require("gulp-less");

process.on('exit', function(code) {
    daemon.stop();
});

gulp.task('watch', ['less'], function() {
    daemon.start();
    gulp.watch('src/server/**/*.js').on('change', function() {
        daemon.restart();
    });
    gulp.watch('src/browser/**/*.less', ['less']);
});
gulp.task('less', function() {
	gulp.src('src/browser/less/style.less').pipe(less()).pipe(gulp.dest('public/dist'));
})
