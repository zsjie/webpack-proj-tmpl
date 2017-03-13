使用 webpack 来对项目进行打包，有利于更好地组织代码，也有利于开发过程中的调试。不过个人感觉 webpack 配置起来还是比较麻烦的，所以我写下这篇文档记录自己的需求，和如何使用 webpack 来满足需求，方便自己回顾。

本文基于 webpack@2.x 版本。

## 基础

webpack 需要一个配置文件来告诉它该如何进行打包，在最简单的情境下，我们只需配置好入口文件和打包文件的输出路径。在项目根目录新建 `webpack.config.js` 如下：

```javascript
const path = require('path')

module.exports = {
  entry: './src/main.js',
  
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

这段配置代码的做的事情是：

- `entry`：告诉 webpack 入口文件是 `src` 目录下的 `main.js` 文件
- `output`：打包好的文件命名为 `bundle.js` 并输出的到 `dist` 目录下

然后在项目根目录下执行 `webpack` 命令，你会发现多了一个 `dist` 目录，里面是打包好的文件。

## 使用 ES6

借助 babel，我们可以在浏览器全面支持之前用上 ES6 的新特性。webpack 将所有文件（包括 CSS，图片等资源）都当做一个模块，所以为了在 webpack 中使用 babel，我们实际上是在 webpack 中配置一个模块加载器 babel-loader：

```shell
npm install --save-dev babel-core babel-loader babel-preset-es2015
```

```javascript
module.exports = {
  entry: './src/main.js',
  
  output: { /* ... */ },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
}
```

这段配置代码的做的事情是：

- `module`：webpack 中配置加载器的选项，即声明什么模块使用什么加载器。上面的配置即声明 js 模块（或者说文件）都使用 `babel-loader`

## 使用 Sass

前面提到 webpack 将所有文件（包括 CSS，图片等资源）都当做一个模块，所以我们配置一个 sass loader 即可：

```shell
npm install --save-dev style-loader css-loader sass-loader node-sass
```

```javascript
module.export = {
  ...
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
}
```

加载 CSS 需要 css-loader 和 style-loader，他们做两件不同的事情，css-loader会遍历 CSS 文件，然后找到 `@import` 和 `url()` 表达式然后处理他们，style-loader 会把原来的 CSS 代码插入页面中的一个 style 标签中。sass-loader 会将 sass 编译成 CSS。注意，scss 文件流经这三个加载器的顺序是 sass -> css -> style。

## 使用 webpack-dev-server

webpack-dev-server 的 hot module reload 属性使我们可以在修改代码后不用手动刷新浏览器也可以看到更新。webpack-dev-server 在配置文件中有一个专门的 `devServer` 属性用于设置相关选项：

```shell
npm install --save-dev webpack-dev-server
```

```javascript
module.export = {
  ...
  devServer: {
    host: '127.0.0.1',
    port: 8937
  }
}
```

然后可以在命令行中执行：

```shell
webpack-dev-server -d --inline --hot --open
```

说一下命令中的各个选项：

- `-d`：等于 `NODE_ENV=development`
- `--inline`：区别于 iframe 模式，在 iframe 模式下，页面会被嵌套在一个 iframe 标签中，iframe 上会有一个 notification bar 提示页面状态；在 inline 模式下在直接在浏览器中渲染页面
- `--hot`：使用 hot module reload 特性
- `--open`：在浏览器中打开 URL
