'use strict'

const debug = require('debug')('simple-site-resources')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
// const mozjpeg = require('imagemin-mozjpeg')
const responsive = require('responsive-images-generator2/lib')

module.exports = {
    imageMinify, imageResponsive
}

function imageMinify(config) {
    return function (dest) {
        const c = Object.assign({}, config)
        c.destination = dest
        return input => imagemin([input], c).then(res => {
            const files = [res[0].destinationPath]
            debug('Minify image', chalk.blue(input), '->', chalk.green(files.map(file => path.relative('', file))))
            return {files}
        })
    }
}

function imageResponsive(configs) {
    return function (dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, {recursive: true})
        }
        const cs = configs.map(c => {
            const res = Object.assign({}, c)
            res.rename = res.rename || {}
            res.rename.dirname = dest
            return res
        })
        return input => responsive.generateResponsiveImages([input], cs).then(files => {
            debug('Responsify image', chalk.blue(input), '->', chalk.green(files.map(file => path.relative('', file))))
            return {files}
        })
    }
}
