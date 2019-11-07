const Router = require('./router')
const { status, json, text, html } = require('./simple-response')
const define = require('./define.js')
const bindings = require('./bindings.js')
/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const r = new Router()
if (define.get) {
    Object.keys(define.get).forEach(k => {
        r.get(k, async (req, params) => {
            try {
                return (await define.get[k](
                    req,
                    params,
                    {
                        status,
                        json,
                        text,
                        html,
                    },
                    bindings
                )).toResponse()
            } catch (e) {
                if (define.error) {
                    return (await define.error(
                        e,
                        req,
                        params,
                        {
                            status,
                            json,
                            text,
                            html,
                        },
                        bindings
                    )).toResponse()
                } else {
                    return status(500)
                        .json({ error: e.toString() })
                        .toResponse()
                }
            }
        })
    })
}
if (define.post) {
    Object.keys(define.post).forEach(k => {
        r.post(k, async (req, params) => {
            try {
                return (await define.post[k](
                    req,
                    params,
                    {
                        status,
                        json,
                        text,
                        html,
                    },
                    bindings
                )).toResponse()
            } catch (e) {
                if (define.error) {
                    return (await define.error(
                        e,
                        req,
                        params,
                        {
                            status,
                            json,
                            text,
                            html,
                        },
                        bindings
                    )).toResponse()
                } else {
                    return status(500)
                        .json({ error: e.toString() })
                        .toResponse()
                }
            }
        })
    })
}

if (define.put) {
    Object.keys(define.put).forEach(k => {
        r.put(k, async (req, params) => {
            try {
                return (await define.put[k](
                    req,
                    params,
                    {
                        status,
                        json,
                        text,
                        html,
                    },
                    bindings
                )).toResponse()
            } catch (e) {
                if (define.error) {
                    return (await define.error(
                        e,
                        req,
                        params,
                        {
                            status,
                            json,
                            text,
                            html,
                        },
                        bindings
                    )).toResponse()
                } else {
                    return status(500)
                        .json({ error: e.toString() })
                        .toResponse()
                }
            }
        })
    })
}
if (define.delete) {
    Object.keys(define.delete).forEach(k => {
        r.delete(k, async (req, params) => {
            try {
                return (await define.delete[k](
                    req,
                    params,
                    {
                        status,
                        json,
                        text,
                        html,
                    },
                    bindings
                )).toResponse()
            } catch (e) {
                if (define.error) {
                    return (await define.error(
                        e,
                        req,
                        params,
                        {
                            status,
                            json,
                            text,
                            html,
                        },
                        bindings
                    )).toResponse()
                } else {
                    return status(500)
                        .json({ error: e.toString() })
                        .toResponse()
                }
            }
        })
    })
}
r.options(`/`, async (req, params) => {
    return text('OK').toResponse()
})

async function handleRequest(request) {
    return await r.route(request)
}
