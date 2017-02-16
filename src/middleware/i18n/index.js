/*!
 * index.js base on https://github.com/toajs/toa-i18n
 * Created by Davis Cai on 2017/02/16
 * Copyright (c) 2017 Davis Cai, caiwxiong@qq.com
 */

'use strict'

var i18n = require('i18n')
var api = ['__', '__n', 'getLocale', 'setLocale', 'getCatalog']

/**
 * Wrap with https://github.com/mashpie/i18n-node
 */

module.exports = function toaI18n(app, options) {
    if (!options || !Array.isArray(options.locales)) throw new Error('options.locales is required')

    var cookiename = typeof options.cookie === 'string' ? options.cookie : null
    var defaultLocale = typeof options.defaultLocale === 'string' ? options.defaultLocale : 'en'
    var locales = {}
    options.defaultLocale = defaultLocale
    options.locales.forEach(function(locale) {
        locales[locale] = true
    })

    i18n.configure(options)

    api.forEach(function(method) {
        app.context[method] = function() {
            return i18n[method].apply(this, arguments)
        }
    })

    Object.defineProperty(app.context, 'locale', {
        enumerable: true,
        configurable: false,
        get: function() {
            if (this._locale) return this._locale
            return initI18n(this)
        },
        set: function(val) {
            this._locale = val + ''
        }
    })

    //app.context.language = undefined

    //return i18n
    return (ctx, next)=>{
        initI18n(ctx);
        ctx.i18n = i18n;
        return next();
    }

    function initI18n(ctx) {
        let languageHeader = ctx.req.acceptsLanguages();

        let languages = []
        let regions = []
        let region = ''

        if (languageHeader) {
            languageHeader.forEach(function(l) {
                let lr = l.split('-', 2)
                if (lr[0]) languages.push(lr[0].toLowerCase())
                if (lr[1]) regions.push(lr[1].toLowerCase())
            })

            if (languages.length > 0) ctx.language = languages[0] || defaultLocale
            if (regions.length > 0) region = regions[0]

            // to test if having region translation
            if (region) region = ctx.language + '-' + region
            if (locales[region]) ctx.language = region
        }

        // setting the language by cookie
        if (cookiename) region = ctx.cookies.get(cookiename)
        if (region) ctx.language = region
        return i18n.setLocale(ctx.language)
    }
}
