var through = require('through2')
const PluginError = require('plugin-error')

const PLUGIN_NAME = 'gulp-timestamp2path'

function timestamp2path(options) {
  // 创建一个让每个文件通过的 stream 通道
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      // 返回空文件
      return cb(null, file)
    }

    if (file.isStream()) {
      cb(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
    }

    if (file.isBuffer()) {
      // console.log(file.path) // 文件的绝对路径  d:\panda-work\td\template\demo.ejs

      let rendered = file.contents.toString()

      let timeStamp = options.timeStamp || new Date().getTime()

      if (options.image) {
        let regArr = [
          {
            reg: /\.jpg/g,
            suffix: '.jpg'
          },
          {
            reg: /\.jpeg/g,
            suffix: '.jpeg'
          },
          {
            reg: /\.png/g,
            suffix: '.png'
          },
          {
            reg: /\.gif/g,
            suffix: '.gif'
          }
        ]
        for (let index = 0; index < regArr.length; index++) {
          const regInfo = regArr[index]
          rendered = rendered.replace(
            regInfo.reg,
            regInfo.suffix + '?t=' + timeStamp
          )
        }
      }

      file.contents = Buffer.from(rendered)

      this.push(file)
    }

    cb(null, file)
  })
}

module.exports = timestamp2path
