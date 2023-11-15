# 一个关于 Tauri 自动更新的 demo

## ⚠️ 拉取项目之后需要先在 tauri.conf.json 中配置`endpoints`和`pubkey`

## 创建项目

Tauri + Vue 3

[参照官网](https://tauri.app/zh-cn/v1/guides/getting-started/setup)这里选用 yarn 构建

1. 输入命令`yarn create tauri-app`

![image-20231115141248276](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151412365.png)

2. 进入目录，随后`yarn`命令初始化项目

3. `yarn tauri dev`启动项目

![image-20231115141729251](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151417308.png)

## 更新配置

1. 打包配置在`src-tauri/tauri.conf.json`

![image-20231115142149884](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151421931.png)

设置一个 updater 属性，属性的层级（位于 tauri 字段下）在紫色框内

需要设置`active`字段为`ture`，并且由于我们需要用自定义更新，所以将`dialog`设置为`false`，其他字段说明在[官网](https://tauri.app/zh-cn/v1/guides/distribution/updater)

2. 设置更新密钥

- 输入命令`yarn tauri signer generate -w ~/.tauri/myapp.key`

![image-20231115142650247](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151426299.png)

需要输入密码（两次）

- 成功之后有提示密钥位置，并且需要设置环境变量

![image-20231115142901389](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151429430.png)

<strong style="color:red">如果私钥丢失就无法更新程序了 ⚠️</strong>

打开文件对应位置，文本编辑打开、复制

将`.pub`后缀的文件内容复制到`pubkey`字段（公钥）

![image-20231115143223181](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151432254.png)

设置环境变量`TAURI_PRIVATE_KEY`是私钥 `TAURI_KEY_PASSWORD`是刚才设置的密码，保存退出之后记得`source`一下，或者重启终端或者电脑让环境变量生效（设置方式可能不同，具体型号具体查）

可以用`echo $TAURI_KEY_PASSWORD`和`echo $TAURI_PRIVATE_KEY`命令来查看是否生效

（私钥也可以写地址，不用那么长）

![image-20231115143709457](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151437520.png)

3. 设置更新服务器

这里用[GitHub Pages](https://pages.github.com/)，因为`endpoints`里的 url 都需要是`https`的。

上传到 GitHub Pages 之后，可以直接通过路径访问到 json 文件，比较方便。

此时向 pages 里面上传一个 json 文件，名字随意，格式如下，必须要有的字段是`version`、`url`、`signature`，其中 version 是 tauri 更新程序用来判断是否需要更新的字段，如果版本低则更新服务器上的高版本。当然也可以用于回退版本，但需要覆盖 Tauri 的版本比较，具体在[文档](https://tauri.app/zh-cn/v1/guides/distribution/updater#dynamic-update-server)

```json
{
  "version": "0.3.0",
  "pub_date": "2020-09-18T12:29:53+01:00",
  "url": "",
  "signature": "",
  "notes": "!可以更新了！"
}
```

`url`字段需要填写下一个版本的文件地址，这里我们可以用阿里云或者七牛云的 oss，或者也可以继续存放在 GitHub Pages 里，当然也可以自己搭建一个文件服务器，等等…只要能有 url 访问即可（这里可以用 http）

然后需要设置`endpoints`

![image-20231115150207371](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151502449.png)

## 打包项目

`yarn tauri build`用于打包项目，打包前记得在 tauri.conf.json 修改版本号

```json
"package": {
    "productName": "tauri-updater-demo", //软件名，可以是中文
    "version": "0.0.0" //版本
  },
```

并且要修改`tauri->bundle->identifier`字段，默认的是`com.tauri.dev`，不修改就打包会报错（只要不是默认值就可以）

![image-20231115145916666](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151459745.png)

然后由于我们希望自定义更新界面【这里使用了 ant-design-vue 需要先根据[官网](https://antdv.com/docs/vue/getting-started-cn)安装配置一下】，所以需要调用一些函数来判断更新，具体代码可以直接[拉取仓库查看](https://github.com/YWwXxx/tauri-updater-demo)，主要代码在`App.vue`、`Update.vue`、`main.js`里

正常页面：

![image-20231115151651114](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151516264.png)

有更新的时候：

![image-20231115151734688](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151517782.png)

点击确定之后就自动更新，随后重启

重启的[api 配置](https://tauri.app/zh-cn/v1/api/js/)

![image-20231115153804141](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151538215.png)

先打包一个 0.0.1 版本的，期间会弹一些框不用管。
此外可能可能会遇到各种权限问题…Mac 用`sudo -E yarn tauri build`（-E 是共享环境变量，否则找不到之前设置的私钥）来打包可能比较省心…

![image-20231115161213398](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151612825.png)

看到 Done 就是成功了，通过输出可以知道安装包位置

![image-20231115161332628](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151613681.png)

可以把打包好的移动到应用程序中，这个是低版本，稍后我们打包另一个高版本来更新

![image-20231115161500924](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151615998.png)

点开确认一下，可以看到版本是 0.0.1

![image-20231115162320395](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151623463.png)

然后我们在`tauri.conf.json`中修改`version`字段为`0.0.2`后再次进行打包

![image-20231115162240422](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151622509.png)

在文件夹中点开确认即可，不要替换了应用程序本来的 0.0.1 版本

![image-20231115162439914](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151624983.png)

然后需要的是`tauri-updater-demo.app.tar.gz`和`tauri-updater-demo.app.tar.gz.sig`这两个文件，其中.sig 结尾的文件内容是更新的`signature`，另一个文件是被 gzip 压缩的程序主体

1. 将`tauri-updater-demo.app.tar.gz`上传到能够访问的路径，并将 url 写到 json 文件的 url 字段中

2. 把`tauri-updater-demo.app.tar.gz.sig`文件内容复制到 GitHub Pages 上的 update.json 文件中的`signature`
3. 其他字段比如`pub_date`是有格式限制的，但不是必填
   `notes`是更新的信息，可以在检查更新时获取，不是必填
   `version`是必填字段，但是可以自己填写版本

当在浏览器输入 json 文件路径的时候能看见 json 文件的内容就是可以的【浏览器中的 json 格式使用的是[JsonForMatter 插件](https://github.com/callumlocke/json-formatter])】

![image-20231115163143968](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151631040.png)

然后点开 0.0.1 版本的程序，显示更新

![image-20231115163706306](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151637370.png)

等待一会，程序会自动关闭，再打开版本就更新了

![image-20231115165050290](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151650489.png)

当然也可以通过 dev 来查看，只要点击了之后控制台没有打印错误就能正常更新（vscode 输出的错误是因为这个不是打包好的程序，找不到某些更新文件的路径）

![image-20231115164133241](https://ywwxxx.oss-cn-fuzhou.aliyuncs.com/markdown/202311151641321.png)
