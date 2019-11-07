/**
 * Helper functions that when passed a request will return a
 * boolean indicating if the request uses that HTTP method,
 * header, host or referrer.
 */
const pathToRegexp = require('path-to-regexp')

const Method = method => req =>
    req.method.toLowerCase() === method.toLowerCase()
const Connect = Method('connect')
const Delete = Method('delete')
const Get = Method('get')
const Head = Method('head')
const Options = Method('options')
const Patch = Method('patch')
const Post = Method('post')
const Put = Method('put')
const Trace = Method('trace')

const Header = (header, val) => req => req.headers.get(header) === val
const Host = host => Header('host', host.toLowerCase())
const Referrer = host => Header('referrer', host.toLowerCase())

const Path = route => req => {
    const keys = []
    const regexp = pathToRegexp(route, keys)
    console.log(regexp)
    const url = new URL(req.url)
    const path = url.pathname
    const res = path.match(regexp)
    if (res && res[0] && res[0] == path) {
        return res.slice(1).map((m, i) => ({ key: keys[i].name, value: m }))
    } else {
        return false
    }
}

/**
 * The Router handles determines which handler is matched given the
 * conditions present for each request.
 */
class Router {
    constructor() {
        this.routes = []
    }

    handle(conditions, handler) {
        this.routes.push({
            conditions,
            handler,
        })
        return this
    }

    connect(url, handler) {
        return this.handle([Connect, Path(url)], handler)
    }

    delete(url, handler) {
        return this.handle([Delete, Path(url)], handler)
    }

    get(url, handler) {
        return this.handle([Get, Path(url)], handler)
    }

    head(url, handler) {
        return this.handle([Head, Path(url)], handler)
    }

    options(url, handler) {
        return this.handle([Options, Path(url)], handler)
    }

    patch(url, handler) {
        return this.handle([Patch, Path(url)], handler)
    }

    post(url, handler) {
        return this.handle([Post, Path(url)], handler)
    }

    put(url, handler) {
        return this.handle([Put, Path(url)], handler)
    }

    trace(url, handler) {
        return this.handle([Trace, Path(url)], handler)
    }

    all(handler) {
        return this.handle([], handler)
    }

    route(req, log) {
        const route = this.resolve(req)

        if (!!route) {
            const matches = route.conditions[1](req)
            let params = {}
            matches.forEach(m => {
                params[m.key] = m.value
            })
            return route.handler(req, params, log)
        }

        return new Response('resource not found', {
            status: 404,
            statusText: 'not found',
            headers: {
                'content-type': 'text/plain',
            },
        })
    }

    /**
     * resolve returns the matching route for a request that returns
     * true for all conditions (if any).
     */
    resolve(req) {
        return this.routes.find(r => {
            if (!r.conditions || (Array.isArray(r) && !r.conditions.length)) {
                return true
            }

            if (typeof r.conditions === 'function') {
                return r.conditions(req)
            }

            return r.conditions.every(c => !!c(req))
        })
    }
}

module.exports = Router
