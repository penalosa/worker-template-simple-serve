module.exports = {
    get: {
        '/foo/:bar': async (req, { bar }, { status }) => {
            return status(200).json({ hello: bar })
        },
        '(.*)': async (req, { bar }, { status }) => {
            return status(404).json({ error: 'Not found' })
        },
    },
}
