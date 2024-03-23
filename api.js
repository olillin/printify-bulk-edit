const { Router } = require('express')

const router = Router()

router.post('/login', (req, res) => {
    const accessToken = req.body?.accessToken
    if (!accessToken) {
        res.status(400).send('No accessToken')
        return
    }
    fetchPrintify('shops.json', {}, 'Bearer ' + accessToken).then(async response => {
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
    if (!req.cookies.accessToken) return null
    return 'Bearer ' + req.cookies.accessToken
}

router.post('/logout', (req, res) => {
    res.clearCookie('accessToken')
    res.sendStatus(200)
})

router.get('/', (req, res) => {
    let loggedIn = !!authFromCookie(req)
    res.json({
        loggedIn: loggedIn,
    })
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

router.put('/:shopId/product/:productId', (req, res) => {
    const shopId = req.params?.shopId
    if (!shopId) {
        res.status(400).send('No shopId')
        return
    }
    const productId = req.params?.productId
    if (!productId) {
        res.status(400).send('No productId')
        return
    }

    console.log(`Updated product ${shopId}:${productId} with the following body:`)
    console.log(req.body)

    console.log(req.body)
    fetchPrintify(
        `shops/${shopId}/products/${productId}.json`,
        {
            method: 'PUT',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
            },
        },
        authFromCookie(req)
    )
        .then(response => response.json())
        .then(json => res.json(json))
})

function fetchPrintify(endpoint, params, auth) {
    const p = Object.assign({}, params)
    if (!p.headers) {
        p.headers = {}
    }
    p.headers.Authorization = auth

    return fetch(`https://api.printify.com/v1/${endpoint}`, p)
}

module.exports = { router }
