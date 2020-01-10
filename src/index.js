'use strict'

const fs = require('fs')
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
        return input => imagemin([input], c).then(res => ({files: [res[0].destinationPath]}))
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
        return input => responsive.generateResponsiveImages([input], cs).then(res => ({files: res}))
    }
}
