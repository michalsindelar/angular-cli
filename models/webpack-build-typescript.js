"use strict";
var path = require('path');
var webpack = require('webpack');
var find_lazy_modules_1 = require('./find-lazy-modules');
var webpack_1 = require('@ngtools/webpack');
var atl = require('awesome-typescript-loader');
var g = global;
var webpackLoader = g['angularCliIsLocal']
    ? g.angularCliPackages['@ngtools/webpack'].main
    : '@ngtools/webpack';
exports.getWebpackNonAotConfigPartial = function (projectRoot, appConfig) {
    var appRoot = path.resolve(projectRoot, appConfig.root);
    var lazyModules = find_lazy_modules_1.findLazyModules(appRoot);
    return {
        resolve: {
            plugins: [
                new atl.TsConfigPathsPlugin({
                    tsconfig: path.resolve(appRoot, appConfig.tsconfig)
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loaders: [{
                            loader: 'awesome-typescript-loader',
                            query: {
                                useForkChecker: true,
                                tsconfig: path.resolve(appRoot, appConfig.tsconfig)
                            }
                        }, {
                            loader: 'angular2-template-loader'
                        }],
                    exclude: [/\.(spec|e2e)\.ts$/]
                }
            ],
        },
        plugins: [
            new webpack.ContextReplacementPlugin(/.*/, appRoot, lazyModules),
            new atl.ForkCheckerPlugin(),
        ]
    };
};
exports.getWebpackAotConfigPartial = function (projectRoot, appConfig) {
    return {
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: webpackLoader,
                    exclude: [/\.(spec|e2e)\.ts$/]
                }
            ]
        },
        plugins: [
            new webpack_1.AotPlugin({
                tsConfigPath: path.resolve(projectRoot, appConfig.root, appConfig.tsconfig),
                mainPath: path.join(projectRoot, appConfig.root, appConfig.main)
            }),
        ]
    };
};
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/models/webpack-build-typescript.js.map