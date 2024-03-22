const { Router } = require('express')

const router = Router()

router.post('/login', (req, res) => {
    const accessToken = req.body?.accessToken
    if (!accessToken) {
        res.status(400).send('No accessToken')
        return
    }
    fetchPrintify('shops.json', {}, authFromCookie(req)).then(async response => {
        if (response.ok) {
            // Valid access token
            const json = await response.json()
            res.cookie('accessToken', accessToken)
            res.send('Logged in, available shops: ' + json.map(shop => shop.title).join(' '))
        } else {
            res.status(401).send('Invalid accessToken')
        }
    })
})

function authFromCookie(req) {
    return 'Bearer ' + req.cookies.accessToken
}

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken')
    res.sendStatus(200)
})

router.get('/shops', async (req, res) => {
    fetchPrintify('shops.json', {}, authFromCookie(req))
        .then(r => r.json())
        .then(json => res.json(json))
})

router.get('/:shopId/products', (req, res) => {
    const shopId = req.params?.shopId
    if (!shopId) {
        res.status(400).send('No shopId')
        return
    }
    fetchPrintify(`shops/${shopId}/products.json`, {}, authFromCookie(req))
        .then(response => response.json())
        .then(json => res.json(json))
})

function fetchPrintify(endpoint, params, auth) {
    const p = Object.assign({}, params)
    if (!p['headers']) {
        p['headers'] = {}
    }
    p['headers']['Authorization'] = auth

    return fetch(`https://api.printify.com/v1/${endpoint}`, p)
}

module.exports = { router }
