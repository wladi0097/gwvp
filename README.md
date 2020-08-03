

## **Unfortunately this project is way too big for one person and will not be maintained anymore. It was fun working on it! :)**



<p align="center">
  <img alt="GWvP" src="https://raw.githubusercontent.com/wladi0097/gwvp/master/src/img/GithubLogo.png" width="400"/>
</p>

<p align="center">
  <a title="Build Status" href="https://travis-ci.org/wladi0097/gwvp"><img src="https://travis-ci.org/wladi0097/gwvp.svg?branch=master">  </a>
  <a title="codecov" href="https://codecov.io/gh/wladi0097/gwvp"><img src="https://codecov.io/gh/wladi0097/gwvp/branch/master/graph/badge.svg"></a>
  <a title="js-standard-style" href="https://github.com/feross/standard"><img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat">  </a>
  <a title="License: MIT" href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg">  </a>
</p>

A one page web application to build **responsive** web pages **quickly** and still have **full control** over the created HTML, JS and CSS.    
It comes with own little components to build a whole page. But you can always create your own or use already created ones.    
**No dependencies** like JQuery or Bootstrap are used in this project but they can be added easily to your page.

I created this project because good "what you see is what you get" editors are ~~too~~ expensive ~~and almost always have a monthly fee~~. So why pay for something i can do myself?

### Getting Started
Either use the *[online version](https://gwvp.glvp.de/)* or create a local copy with:

```bash
 > git clone https://github.com/wladi0097/gwvp.git
 > cd gwvp/
 > npm install
```
and run it with ``npm start``

### Contributing
I'm using *[Gitflow](https://github.com/nvie/gitflow)* to make my life easier
1. Fork it!
2. Follow *[this simple guide](https://danielkummer.github.io/git-flow-cheatsheet/)*
5. Submit a pull request

### CLI Scripts:
execute with ``npm run {{command}}``

``test`` 	- run all Javascript tests    
``testw`` 	- run Javascript tests in watch mode    
``testc`` 	- get Javascript test coverage report    
``build`` 	- build whole project (see webpack.config.js)   
``start`` 	- build program in watch mode with a dev-server   
``docs`` 	- create inline documentation HTML-page    
``license``	- get all production relevant licensenses    
``lints`` 	- get SASS lint report   
``lintj`` 	- get Javascript lint report    

### Made with:

* *[Font Awesome](http://fontawesome.io)* for awesome icons
* and custom configurable development dependencies

### Made with (for development):

 * *[webpack](https://webpack.js.org/)* is a module bundler.
 * *[webpack-dev-server](https://github.com/webpack/webpack-dev-server)* is a development server that provides live reloading.
 * *[css-loader](https://github.com/webpack-contrib/css-loader)* module for webpack.
 * *[file-loader](https://github.com/webpack-contrib/file-loader)* module for webpack.
 * *[html-loader](https://github.com/webpack-contrib/html-loader)* module for webpack.
 * *[style-loader](https://github.com/webpack-contrib/style-loader)* module for webpack to add CSS to the DOM by injecting a style tag.
 * *[sass-loader](https://github.com/webpack-contrib/sass-loader)* module for webpack to Compiles Sass to CSS.
 * *[uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin)* is a webpack plugin to minify your JavaScript.
 * *[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)* is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles
 * *[babel](https://babeljs.io/)* is a compiler for writing next generation JavaScript. With *[babel-core](https://github.com/babel/babel/tree/master/packages/babel-core)*, *[babel-loader](https://github.com/babel/babel-loader)*, *[babel-polyfill](https://github.com/babel/babel/tree/master/packages/babel-polyfill)*, *[babel-preset-env](https://github.com/babel/babel-preset-env)* and *[babel-preset-es2015](https://github.com/babel/babel/tree/master/packages/babel-preset-es2015)*
 * *[documentation](http://documentation.js.org/)* is a documentation system.
 * *[eslint](https://eslint.org/)* is a linting utility for JavaScript. With  *[eslint-config-standard](https://github.com/standard/eslint-config-standard)*,
 *[eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)*, *[eslint-plugin-node](https://github.com/mysticatea/eslint-plugin-node)*, *[eslint-plugin-promise](https://github.com/xjamundx/eslint-plugin-promise)*, *[eslint-plugin-standard](https://github.com/xjamundx/eslint-plugin-standard)*
 * *[jest](https://facebook.github.io/jest/)* for JavaScript Testing.
 * *[node-sass](https://github.com/sass/node-sass)* allows you to natively compile .scss files.
 * *[license-checker](https://github.com/davglass/license-checker)* to list all licenses from all dependencies.

### License
* [License: MIT](https://github.com/wladi0097/gwvp/blob/master/LICENSE)
