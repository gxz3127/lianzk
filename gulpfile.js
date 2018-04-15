var gulp=require("gulp"); //引入gulp文件
 
var mincss=require("gulp-clean-css"); //压缩css

var uglify=require("gulp-uglify");//压缩js

var htmlmin=require("gulp-htmlmin");//压缩html

var sass=require("gulp-sass");//编译scss

var server=require("gulp-webserver");//起服务

var data=require("./src/data/data.json");

var sequence=require("gulp-sequence");

var clean=require("gulp-clean");


gulp.task("default",function(callback){
    sequence("clean",["mincss","htmlmin","minjs"],"watch","server",callback)//设置任务的执行顺序
})//默认执行代码

gulp.task("clean",function(){
   return gulp.src("disk")
    .pipe(clean())
})

gulp.task("mincss",function(){
   return gulp.src("./src/css/*.scss")
    .pipe(sass())
    .pipe(mincss())
    .pipe(gulp.dest("disk/css"))
})

var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    //collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    // removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    // removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    // minifyJS: true, //压缩页面JS
    // minifyCSS: true //压缩页面CSS
};
gulp.task("htmlmin",function(){
   return gulp.src("./src/*.html")
    .pipe(htmlmin(options))
    .pipe(gulp.dest("disk"))
})

gulp.task("copyjs",function(){
   return gulp.src("src/js/*.js")
    .pipe(gulp.dest("disk/js"))
})

gulp.task("minjs",function(){
   return gulp.src("./src/js/demo.js")
    .pipe(uglify())
    .pipe(gulp.dest("disk/js"))
})

gulp.task("watch",function(){
    gulp.watch("src/*.html",["htmlmin"])
    gulp.watch("src/css/*.scss",["mincss"])
    gulp.watch("src/js/*.js",['minjs'])
})

gulp.task("server",function(){
    gulp.src("./src")
    .pipe(server({
         port:8080,
         open:true,
         livereload:true,
         host:"localhost",
         middleware:function(req,res,next){
             if(/\/list/g.test(req.url)){
                res.end(JSON.stringify(data))
             } 
             next()
         }
    }))
})