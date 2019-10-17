const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Authorization, X-Auth-Token',
}
const R = (status = 200, headers = {}, body = '') => {
    return {
        status: new_status => R(new_status, headers, body),
        headers: new_headers => {
            let standard_headers = {}
            Object.keys(new_headers).forEach(
                k => (standard_headers[k.toLowerCase()] = new_headers[k])
            )
            R(status, new_headers, body)
        },
        raw: new_body => R(status, headers, new_body),
        json: new_json =>
            R(
                status,
                { ...headers, 'content-type': 'application/json' },
                JSON.stringify(new_json)
            ),
        text: new_text =>
            R(status, { ...headers, 'content-type': 'text/plain' }, new_text),
        html: new_html =>
            R(status, { ...headers, 'content-type': 'text/html' }, new_html),
        toResponse: () =>
            new Response(body, {
                headers: { ...headers, ...corsHeaders },
                status,
            }),
    }
}

let instance = R()
exports.status = instance.status
exports.headers = instance.headers
exports.raw = instance.raw
exports.json = instance.json
exports.text = instance.text
exports.html = instance.html
