// gulp
var gulp = require('gulp');
var concat = require('gulp-concat');
var directoryMap = require("gulp-directory-map");

gulp.task('macros', function() {
    gulp.src(['macros/**.js', 'macros/*/**.js'])
        .pipe(directoryMap({filename: 'macros.json'}))
        .pipe(gulp.dest('lib'));

   var macrofiles = require('./lib/macros.json');

    for(var file in macrofiles){
        console.log(file);
        gulp.src(['lib/iMacroLibrary.js','macros/'+file])
        .pipe(concat(file))
        .pipe(gulp.dest('run'))
    }
});

gulp.task('watch',function(){
    gulp.watch(['lib/iMacroLibrary.js','macros/**.js','macros/*/**.js'], ['macros']);

})
  
gulp.task('default', ['macros', 'watch']);
