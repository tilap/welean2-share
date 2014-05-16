var gulp = require('gulp');
var child_process = require('child_process');
var daemon = require('springbokjs-daemon').node([ 'app/server.js' ]);

process.on('exit', function(code) {
    daemon.stop();
});


gulp.task('watch', function() {
    daemon.start();
    gulp.watch('app/**/*.js').on('change', function() {
        daemon.restart();
    });
});