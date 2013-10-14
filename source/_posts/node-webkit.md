title: node-webkit 教程
date: 2013-10-20 22:10:00
tags: [webapp,nodejs]
---

## 打包

### OSX

###step 1

在终端执行下面的命令:

1. 进入 node-webik 项目文件夹 ```cd ~/Projects/my_app```
2. 压缩 ```Run zip -r ../${PWD##*/}.nw *```
3. 现在就会有一个 .nw 缀的文件在上一层的目录里

如果机器已安装了 node-webkit.app [32bit, 10.7+](https://s3.amazonaws.com/node-webkit/v0.7.5/node-webkit-v0.7.5-osx-ia32.zip)，就可以直接运行 .nw 的文件，如果想封装成app，请到第二步。

<!-- more -->

###step 2

1. 下载 node-webkit.app
2. 右键 node-webkit.app 选择显示包内容，进入 ```Contents/Resources```目录，将上一步的 my_app.nw 重命名为 app.nw, 然后复制进来
3. ```Contents/Resources/app.icns``` 这就是app的默认图标，可以己indow