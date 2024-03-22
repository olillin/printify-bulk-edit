const shopSelect = document.getElementById('shop')
const productsList = document.getElementById('products')

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
    const id = shopSelect.value
    console.log('Selected shop: ' + id)
    loadListings(id)
}

function loadListings(id) {
    fetch(`/api/${id}/products`)
        .then(res => res.json())
        .then(json => {
            const products = json.data
            for (let product of products) {
                const productDiv = document.createElement('div')

                const checkBox = document.createElement('input')
                checkBox.type = 'checkbox'
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
