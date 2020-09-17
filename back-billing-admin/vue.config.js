const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    publicPath:process.env.NODE_ENV=="production"?"./":"/",  //打包配置，解决页面空白的配置方案。
    outputDir: 'dist',
    assetsDir: 'static',
    productionSourceMap: false,
    //配置跨域
    devServer: {
        open: true,
        host: 'localhost',
        port: 8090,
        https: false,
        hotOnly: true,
        disableHostCheck: true,
       // proxy: "https://web.datasw.cn/device"
        proxy: {//配置跨域
            '/api': {
                target: 'https://web.datasw.cn/device/',
                changOrigin: true,//允许跨域
            },

            '/json': {
                target: 'https://web.datasw.cn/device/',
                changOrigin: true,//允许跨域
                pathRewrite: {
                    "^/json": "/"
                }
            },
        }
    },
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
    }
}