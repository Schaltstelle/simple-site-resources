'use strict'

const debug = require('debug')('simple-site-resources')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const responsive = require('responsive-images-generator2/lib')
const cleanCss = require('clean-css')

module.exports = {
    imageMinify, imageResponsive,
    cssMinify
}

function imageMinify(config) {
    return function (dest) {
        const c = Object.assign({}, config)
        c.destination = dest
        return input => imagemin([input], c).then(res => {
            const files = [res[0].destinationPath]
            log('Minify image', input, files)
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
            log('Responsify image', input, files)
            return {files}
        })
    }
}

function cssMinify(config) {
    return function (dest) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, {recursive: true})
        }
        const clean = new cleanCss({level: 2, ...config, returnPromise: true})
        return input => clean.minify(fs.readFileSync(input)).then(res => {
            const name = path.parse(input)
            let files = [path.join(dest, name.base)]
            return new Promise((resolve, reject) => {
                fs.writeFile(files[0], res.styles, 'utf8', (err, data) => {
                    if (err) {
                        reject(err)
                    } else {
                        log('Clean CSS', input, files)
                        resolve({files})
                    }
                })
            })
        })
    }
}

function log(name, input, files) {
    debug(name, chalk.blue(input), '->', chalk.green(files.map(file => path.relative('', file))))
}
