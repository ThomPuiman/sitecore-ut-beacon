var path = require('path');
module.exports = {
    entry: {
        tracker: "./main.ts"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, '..', 'web', 'js', 'dist')
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".js"]
    },
    module: {
        rules: [{ test: /\.ts$/, use: "ts-loader" }]
    }
 };