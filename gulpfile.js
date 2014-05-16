var gulp = require('gulp');

gulp.task('watch', function() {
	gulp.watch('src/**/*.js').on('change', function(file) {
		node('index.js');
	})
});