title: grunt入门
date: 2013-10-11 13:35:21
tags: [grunt]
---

![grount icon](http://farm4.staticflickr.com/3696/10202053713_38f3bbb50a_t.jpg)



## 安装 CLI
首先需要安装[nodejs](http://nodejs.org/ "nodejs 官网")和[npm](http://npm.org/ "npm 官网")包管理。

```
npm install -g grunt-cli
```

注意，安装 grunt-cli 并不等于安装了grunt！grunt CLI的任务很简单：调用与Gruntfile在同一目录中grunt。这样带来的好处是，允许你在同一个系统上同时安装多个版本的grunt

如果是安装了grunt 0.3之前的版本，请先卸载 grunt 再安装 grunt-cli

<!--more-->


## 开发前准备
在项目文件夹中添加两份文件：package.json 和 Gruntfile

**package.json**: 此文件被npm用于存储项目的元数据，以便将此项目发布为npm模块。你可以在此文件中列出项目依赖的grunt和Grunt插件，放置于devDependencies配置段内。

**Gruntfile**: 此文件被命名为 `Gruntfile.js` 或 `Gruntfile.coffee`，用来配置或定义任务（task）并加载Grunt插件的。

## package.json
创建package.json文件的方式：

* 大部分 grunt-init 模版都会自动创建特定于项目的package.json文件。
* npm init命令会创建一个基本的package.json文件。
* 复制下面的案例，并根据需要做扩充，参考此说明.

```
{
  "name": "my-project-name",
  "version": "0.1.0",
  "devDependencies": {//依赖的grunt和Grunt插件
    "grunt": "~0.4.1",
    "grunt-contrib-jshint": "~0.6.0",
    "grunt-contrib-nodeunit": "~0.2.0",
    "grunt-contrib-uglify": "~0.2.2"
  }
}
```

## Gruntfile
Gruntfile由以下几部分构成：

* "wrapper" 函数
* 项目与任务配置
* 加载grunt插件和任务
* 自定义任务

```
//wapper 函数
module.exports = function(grunt) {

  // 项目与任务配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    }
  });

  // 加载 "uglify" 任务的插件。
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // 注册 uglify 任务
  grunt.registerTask('uglify', ['uglify']);

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['uglify']);

};
```
特定于项目的任务不必在Gruntfile中定义。他们可以定义在外部.js 文件中，并通过```grunt.loadTasks``` 方法加载。

通过定义 default 任务，可以让Grunt默认执行一个或多个任务。在下面的这个案例中，执行 ```grunt``` 命令时如果不指定一个任务的话，将会执行uglify任务。这和执行```grunt uglify``` 或者 ```grunt default```的效果一样