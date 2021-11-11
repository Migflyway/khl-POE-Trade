const path = require('path');

function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: './',
  lintOnSave: false, // 取消 eslint
  devServer: {
    // can be overwritten by process.env.HOST
    host: '0.0.0.0',  
    port: 3030
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        publish: null,
        win: {
          icon: './public/app.ico'
        },
        mac: {
          icon: './public/app.png'
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('src', resolve('src'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'));
  }
};
