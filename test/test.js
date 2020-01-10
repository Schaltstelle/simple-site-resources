'use strict'

const ssr = require('../src/index')
const assert = require('assert')
const fs = require('fs')
const mozjpeg = require('imagemin-mozjpeg')

describe('imageMinify', () => {
    it('should minify', () => ssr.imageMinify({plugins: [mozjpeg()]})('test-out')('test/teacup.jpg').then(res => {
        assert.deepEqual(res, {files: ['test-out/teacup.jpg']})
        assert(fs.existsSync('test-out/teacup.jpg'))
        assert(fs.statSync('test-out/teacup.jpg').size < fs.statSync('test/teacup.jpg').size)
    }))
})

describe('imageResponsive', () => {
    it('should create versions', () => ssr.imageResponsive([
        {width: 20, rename: {suffix: '@20'}},
        {height: 10, rename: {suffix: '@10'}}])
    ('test-out')('test/teacup.jpg').then(res => {
        assert.deepEqual(res, {files: ['test-out/teacup@20.jpg', 'test-out/teacup@10.jpg']})
        assert(fs.existsSync('test-out/teacup@10.jpg'))
        assert(fs.existsSync('test-out/teacup@20.jpg'))
        assert(fs.statSync('test-out/teacup@10.jpg').size < fs.statSync('test/teacup.jpg').size)
        assert(fs.statSync('test-out/teacup@20.jpg').size < fs.statSync('test/teacup.jpg').size)
    }))
})
