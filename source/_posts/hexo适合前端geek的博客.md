title: hexo 适合前端 geek 的博客
date: 2013-10-12 19:35:21
tags: [hexo]
---

hexo 是一个基于 Node.js 的静态博客程序，编译上百篇文字只需要几秒，和Octopress项目，速度占有很大的优势。hexo 只需要将生成静态网页放到服务器上就可以了，所以可以将博客托管在github、hreoku、bae等平台上。

* 项目地址 <https://github.com/tommy351/hexo>
* 官网 <http://zespia.tw/hexo>
* 作者 <https://twitter.com/tommy351>


## 安装
首先需要安装[nodejs](http://nodejs.org/ "nodejs 官网")和[npm](http://npm.org/ "npm 官网")包管理。

```
npm install -g hexo
```

<!--more-->
## 更新
```
npm update -g hexo
```

## 初始化博客
进入到指定的目录然后执行

```
hexo init <folder>
```

## 新建文章

```
hexo new 'title'
```

在/source/_post/就可以找到相应的文件了,文章是使用［markdown］（http://wowubuntu.com/markdown/）语法编写的

## 使用插件

hexo提供了一些[插件](https://github.com/tommy351/hexo/wiki/Plugins)给大家选择使用，通过插件，例如可以实现rss订阅功能

```
npm install <plugin-name> --save
```

如何在_config.yml文件加上

```
plugins:
- hexo-generator-feed  //插件名
```

插件可以在[这里](https://github.com/tommy351/hexo/wiki/Plugins)找到

## 评论
静态博客的评论是要使用第三方评论，DISQUS 比较有名的社会化评论，国内有多说。

使用DISQUS很简单，只需要去DISQUS注册一个账号，然后修改_config.yml文件。

```
disqus_shortname: disqus_id
```/Users/zikkeung/Documents/code/hexo/source/_posts/hello-world.md

如果要用多说，将多说提供的代码覆盖掉 ** /themes/light/layout/_partial/comment.ejs ** 里的。


## 生成静态文件

```
hexo generate
```
执行 generate 命令后，会在 public 文件夹生成静态博客文件，讲此文件夹传上去服务器环境即可

## 预览博客

```
hexo server
```

## 发布博客

部署到 Github 需要配置_config.yml文件。

```
deploy:
  type: github
  repository: git@github.com:zikkeung/zikkeung.github.com.git
  branch: master
```

发布命令

```
hexo deploy  
```


经过上面的步骤，你的博客就初步弄好了，尽情的写博客吧

