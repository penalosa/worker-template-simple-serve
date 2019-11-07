const Router = require('./router')
const shortid = require('shortid')
const { status, json, text, html } = require('./simple-response')
const bindings = require('./bindings.js')
const define = require('./define.js').handlers(
    { status, json, text, html },
    { bindings }
)

/**
 * Example of how router can be used in an application
 *  */
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})
const r = new Router()
;[('get', 'post', 'put', 'delete')].forEach(method => {
    if (!define[method]) {
        return
    }
    Object.keys(define[method]).forEach(k => {
        r[method](k, async (req, params, log) => {
            try {
                return (await define[method][k](req, params, log)).toResponse()
            } catch (e) {
                if (define.error) {
                    return (await define.error(
                        e,
                        req,
                        params,
                        log
                    )).toResponse()
                } else {
                    log.err(e.toString())
                    return status(500)
                        .json({ error: e.toString() })
                        .toResponse()
                }
            }
        })
    })
})

r.options(`/`, async (req, params) => {
    return text('OK').toResponse()
})
const logger = () => {
    let logs = []
    let date = Date.now()
    let key = `${date.toLocaleDateString()}_${shortid()}`
    return {
        info: l => logs.push({ type: 'info', content: l }),
        err: l => logs.push({ type: 'err', content: l }),
        warn: l => logs.push({ type: 'warn', content: l }),
        req: (method, url, ip) => logs.push({ type: 'req', method, url, ip }),
        dump: () => ({ key, logs }),
    }
}

async function handleRequest(request) {
    try {
        let log = logger()
        log.req(
            request.method,
            request.url,
            request.headers.get('CF-Connecting-IP')
        )
        let ret = await r.route(request, log)
        let log_dump = log.dump()
        bindings['logs'].put(log_dump.key, JSON.stringify(log_dump.logs))
        return ret
    } catch (e) {
        return new Response(e.toString(), {
            status: 500,
        })
    }
}
