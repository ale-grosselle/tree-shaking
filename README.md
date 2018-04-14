##Description
The aim of this repository is to test tree shaking implementing a lib with RollUp and including it into 
a webpack application.

Rollup library code is into rollupLib folder and application in webpackApp.

To enhance the tree shaking in a webpack project  we must to set:
* resolve.mainFields: ['module', 'browser', 'main']. 
* To minify, now we are using 'babel-minify-webpack-plugin' instead of UglifyJsPlugin (UglifyJsPlugin works but 'babel-minify-webpack-plugin' is a few better)

This repository collects two sub repository.