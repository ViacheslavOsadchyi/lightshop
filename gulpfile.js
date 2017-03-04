var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var addSrc = require('gulp-add-src');

gulp.task( "styles", function (){
	return 	gulp.src( ["inc/bootstrap-sass/assets/stylesheets/bootstrap.scss", "dev/sass/*.scss", "inc/font-awesome/css/font-awesome.css"] )
			.pipe(sass().on( "error", sass.logError ))
			.pipe(concat("main.css"))
			.pipe(gulp.dest("public/assets/css"));
});

gulp.task( "admin-styles", function (){
	return 	gulp.src( ["inc/bootstrap-sass/assets/stylesheets/bootstrap.scss", "inc/sb-admin/sb-admin.css", "inc/font-awesome/css/font-awesome.css"] )
			.pipe(sass().on( "error", sass.logError ))
			.pipe(concat("admin.css"))
			.pipe(gulp.dest("public/assets/css"));
});

gulp.task( "bootstrap-fonts", function(){
	return 	gulp.src("inc/bootstrap-sass-3.3.7/assets/fonts/bootstrap/*", "")
			.pipe( gulp.dest("public/assets/fonts/bootstrap") );
});

gulp.task( "font-awesome-fonts", function(){
	return 	gulp.src("inc/font-awesome/fonts/*")
			.pipe( gulp.dest("public/assets/fonts") );
});

gulp.task( "js", function (){
	return 	gulp.src( ["inc/jquery/jquery-3.1.1.js", "inc/bootstrap-sass/assets/javascripts/bootstrap.js"] )
			.pipe(concat("main.js"))
			.pipe(gulp.dest("public/assets/js"));
});

gulp.task( "default", ["styles", "admin-styles", "bootstrap-fonts", "font-awesome-fonts", "js"] );