"use strict";
var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var SilentError = require('silent-error');
var Task = require('ember-cli/lib/models/task');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var _1 = require('../models/');
var webpack_config_1 = require('../models/webpack-config');
var config_1 = require('../models/config');
var common_tags_1 = require('common-tags');
var url = require('url');
var opn = require('opn');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Task.extend({
    run: function (commandOptions) {
        var ui = this.ui;
        var webpackCompiler;
        var config = new webpack_config_1.NgCliWebpackConfig(this.project, commandOptions.target, commandOptions.environment, undefined, undefined, commandOptions.aot).config;
        // This allows for live reload of page when changes are made to repo.
        // https://webpack.github.io/docs/webpack-dev-server.html#inline-mode
        config.entry.main.unshift("webpack-dev-server/client?http://" + commandOptions.host + ":" + commandOptions.port + "/");
        webpackCompiler = webpack(config);
        webpackCompiler.apply(new ProgressPlugin({
            profile: true,
            colors: true
        }));
        var proxyConfig = {};
        if (commandOptions.proxyConfig) {
            var proxyPath = path.resolve(this.project.root, commandOptions.proxyConfig);
            if (fs.existsSync(proxyPath)) {
                proxyConfig = require(proxyPath);
            }
            else {
                var message = 'Proxy config file ' + proxyPath + ' does not exist.';
                return Promise.reject(new SilentError(message));
            }
        }
        var sslKey = null;
        var sslCert = null;
        if (commandOptions.ssl) {
            var keyPath = path.resolve(this.project.root, commandOptions.sslKey);
            if (fs.existsSync(keyPath)) {
                sslKey = fs.readFileSync(keyPath, 'utf-8');
            }
            var certPath = path.resolve(this.project.root, commandOptions.sslCert);
            if (fs.existsSync(certPath)) {
                sslCert = fs.readFileSync(certPath, 'utf-8');
            }
        }
        var webpackDevServerConfiguration = {
            contentBase: path.resolve(this.project.root, "./" + config_1.CliConfig.fromProject().config.apps[0].root),
            historyApiFallback: {
                disableDotRule: true,
            },
            stats: _1.webpackDevServerOutputOptions,
            inline: true,
            proxy: proxyConfig,
            compress: commandOptions.target === 'production',
            watchOptions: {
                poll: config_1.CliConfig.fromProject().config.defaults.poll
            },
            https: commandOptions.ssl
        };
        if (sslKey != null && sslCert != null) {
            webpackDevServerConfiguration.key = sslKey;
            webpackDevServerConfiguration.cert = sslCert;
        }
        ui.writeLine(chalk.green((_a = ["\n      **\n      NG Live Development Server is running on\n      http", "://", ":", ".\n      **\n    "], _a.raw = ["\n      **\n      NG Live Development Server is running on\n      http", "://", ":", ".\n      **\n    "], common_tags_1.oneLine(_a, commandOptions.ssl ? 's' : '', commandOptions.host, commandOptions.port))));
        var server = new WebpackDevServer(webpackCompiler, webpackDevServerConfiguration);
        return new Promise(function (resolve, reject) {
            server.listen(commandOptions.port, "" + commandOptions.host, function (err, stats) {
                if (err) {
                    console.error(err.stack || err);
                    if (err.details) {
                        console.error(err.details);
                    }
                    reject(err.details);
                }
                else {
                    var open = commandOptions.open, host = commandOptions.host, port = commandOptions.port;
                    if (open) {
                        opn(url.format({ protocol: 'http', hostname: host, port: port.toString() }));
                    }
                }
            });
        });
        var _a;
    }
});
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/tasks/serve-webpack.js.map