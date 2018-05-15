const common = require("./webpack.common")
const merge = require("webpack-merge")
const Minify = require("webpack-closure-compiler")

module.exports = merge(common, {
    mode: "production",
    output: {
        filename: "jstemplate.min.js"
    },
    plugins: [
        new Minify()
    ]
})
