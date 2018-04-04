var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');//声明-压缩js
var minifycss = require('gulp-minify-css');//声明-压缩css
var jshint = require('gulp-jshint');//声明-检测js语法
var revCollector = require('gulp-rev-collector');//声明-修改地址路径
var rev = require('gulp-rev');//声明-生成md5
var clean = require('gulp-clean');//声明-清除

//清空dist目录
gulp.task('clean',function(){
	return gulp.src('app/dist',{read:false})
		.pipe(clean());
});

//压缩js
gulp.task('concat_js', function(){
    return gulp.src('app/src/js/tool/*.js')
        .pipe(concat('tool.js'))
        .pipe(gulp.dest('app/src/js'))
});

//压缩js
gulp.task('js', function(){
	return gulp.src('app/src/js/*.js')
        .pipe(uglify())//压缩js
        .pipe(rev())
        .pipe(gulp.dest('app/dist/js'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('app/rev/js'));
});

//压缩css
gulp.task('css', function(){
    return gulp.src('app/src/css/*.css')
        .pipe(minifycss())//压缩js
        .pipe(rev())
        .pipe(gulp.dest('app/dist/css'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('app/rev/css'));
});

//检测js
gulp.task('jshint', function() {
  return gulp.src('app/src/js/*.js')
    .pipe(jshint())       // 进行检查
    .pipe(jshint.reporter('default'))  // 对代码进行报错提示
});

//生成md5并修改index.html引用路径
gulp.task('rev',['js','css'], function () {
    return gulp.src(['app/rev/**/rev-manifest.json','app/src/index.html'])
        .pipe(revCollector({
            replaceReved:true,
            dirReplacements:{
            	'app/src/js':'app/dist/js',
                'app/src/css':'app/dist/css'
            }
        }))
        .pipe(gulp.dest(''));
});

gulp.task('default', ['clean','concat_js'], function() {
	gulp.start('js','css','rev','jshint');
});