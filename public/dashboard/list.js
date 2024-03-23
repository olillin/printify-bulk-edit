const shopSelect = document.getElementById('shop')
const productsList = document.getElementById('products')

var products

document.getElementById('logout')?.addEventListener('click', () => {
    fetch('/api/logout', { method: 'POST' }).then(() => {
        window.location.href = '/'
    })
})

const shops = []
function loadShops() {
    fetch('/api/shops')
        .then(res => res.json())
        .then(json => {
            for (let shop of json) {
                shops.push(shop)

                const option = document.createElement('option')
                option.value = shop.id
                option.innerHTML = shop.title
                shopSelect.appendChild(option)
            }
            reloadShop()
        })
}
loadShops()

shopSelect.addEventListener('change', reloadShop)

function reloadShop() {
    const shopId = shopSelect.value
    console.log('Selected shop: ' + shopId)
    loadListings(shopId)
}

function getSelectedProductIds() {
    return new Set(
        Array.from(productsList.querySelectorAll('input[type=checkbox]'))
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value)
    )
}

function loadListings(shopId) {
    const previouslySelectedIds = getSelectedProductIds()
    productsList.innerHTML = ''

    fetch(`/api/${shopId}/products`)
        .then(res => res.json())
        .then(json => {
            products = json.data
            for (let product of products) {
                const productDiv = document.createElement('div')

                const checkBox = document.createElement('input')
                checkBox.type = 'checkbox'
                checkBox.value = product.id
                if (previouslySelectedIds.has(product.id)) {
                    checkBox.checked = true
                }
                productDiv.appendChild(checkBox)

                const coverImageUrl = product.images.filter(e => e.is_default)[0].src
                const coverImage = document.createElement('img')
                coverImage.src = coverImageUrl
                productDiv.appendChild(coverImage)

                const title = document.createElement('span')
                title.innerHTML = product.title
                productDiv.appendChild(title)

                productsList.appendChild(productDiv)
            }
        })
}
