const editTitleButton = document.getElementById('editTitle')
const editTitlePanel = document.getElementById('editTitlePanel')
const editDescriptionButton = document.getElementById('editDescription')
const editDescriptionPanel = document.getElementById('editDescriptionPanel')
const replaceTitleButton = document.getElementById('replaceTitle')
const replaceTitlePanel = document.getElementById('replaceTitlePanel')
const replaceDescriptionButton = document.getElementById('replaceDescription')
const replaceDescriptionPanel = document.getElementById('replaceDescriptionPanel')

const panels = new Array(editTitlePanel, editDescriptionPanel, replaceTitlePanel, replaceDescriptionPanel)
const buttons = new Array(editTitleButton, editDescriptionButton, replaceTitleButton, replaceDescriptionButton)
function hidePanels() {
    panels.forEach(panel => {
        panel.style.display = 'none'
    })
    buttons.forEach(button => {
        button.classList.remove('selected')
    })
}
hidePanels()

document.addEventListener('click', updateButtonLabels)

editTitleButton?.addEventListener('click', openEditTitlePanel)
editDescriptionButton?.addEventListener('click', openEditDescriptionPanel)
replaceTitleButton?.addEventListener('click', openReplaceTitlePanel)
replaceDescriptionButton?.addEventListener('click', openReplaceDescriptionPanel)

editTitlePanel?.querySelector('form').addEventListener('submit', editTitle)
editDescriptionPanel?.querySelector('form').addEventListener('submit', editDescription)
replaceTitlePanel?.querySelector('form').addEventListener('submit', replaceTitle)
replaceDescriptionPanel?.querySelector('form').addEventListener('submit', replaceDescription)

function openEditTitlePanel() {
    updateButtonLabels()
    hidePanels()
    editTitlePanel.style.display = 'block'
    editTitleButton.classList.add('selected')
}

function openEditDescriptionPanel() {
    updateButtonLabels()
    hidePanels()
    editDescriptionPanel.style.display = 'block'
    editDescriptionButton.classList.add('selected')
}

function openReplaceTitlePanel() {
    updateButtonLabels()
    hidePanels()
    replaceTitlePanel.style.display = 'block'
    replaceTitleButton.classList.add('selected')
}

function openReplaceDescriptionPanel() {
    updateButtonLabels()
    hidePanels()
    replaceDescriptionPanel.style.display = 'block'
    replaceDescriptionButton.classList.add('selected')
}

function updateButtonLabels() {
    const selectedProductIds = getSelectedProductIds()
    editTitlePanel.querySelector('button[type=submit]').innerHTML = `Set title of ${selectedProductIds.size} products`
    editDescriptionPanel.querySelector('button[type=submit]').innerHTML = `Set description of ${selectedProductIds.size} products`
    replaceTitlePanel.querySelector('button[type=submit]').innerHTML = `Replace in title of ${selectedProductIds.size} products`
    replaceDescriptionPanel.querySelector('button[type=submit]').innerHTML = `Replace in description of ${selectedProductIds.size} products`
}

function editTitle(event) {
    event.preventDefault()

    const selectedProductIds = getSelectedProductIds()
    const shopId = shopSelect.value

    const title = document.getElementById('editTitleText').value

    const tasks = []
    selectedProductIds.forEach(productId => {
        tasks.push(
            fetch(`/api/${shopId}/product/${productId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: title,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        )
    })

    Promise.all(tasks).then(() => {
        const output = editTitlePanel.querySelector('.output')
        output.innerHTML = ''
        var errors = 0

        tasks.forEach(task => {
            task.then(result => {
                if (!result.ok) {
                    errors++
                    console.error(result)
                }
            })
        })

        if (errors == 0) {
            output.innerHTML = 'Successfully updated titles'
        } else {
            output.innerHTML = `Encountered ${errors} errors while processing request, check console for more info`
        }
        reloadShop()
    })
}

function editDescription(event) {
    event.preventDefault()

    const selectedProductIds = getSelectedProductIds()
    const shopId = shopSelect.value

    const description = document.getElementById('editDescriptionText').value

    const tasks = []
    selectedProductIds.forEach(productId => {
        tasks.push(
            fetch(`/api/${shopId}/product/${productId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    description: description,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        )
    })

    Promise.all(tasks).then(() => {
        const output = editDescriptionPanel.querySelector('.output')
        output.innerHTML = ''
        var errors = 0

        tasks.forEach(task => {
            task.then(result => {
                if (!result.ok) {
                    errors++
                    console.error(result)
                }
            })
        })

        if (errors == 0) {
            output.innerHTML = 'Successfully updated descriptions'
        } else {
            output.innerHTML = `Encountered ${errors} errors while processing request, check console for more info`
        }
        reloadShop()
    })
}

function replaceTitle(event) {
    event.preventDefault()

    const shopId = shopSelect.value

    var pattern = document.getElementById('replaceTitlePattern').value
    const useRegex = document.getElementById('replaceTitleWithRegex').checked
    if (useRegex) {
        pattern = RegExp(pattern)
    }
    const replaceWith = document.getElementById('replaceTitleWith').value

    const selectedProductIds = getSelectedProductIds()
    const tasks = []
    products
        .filter(product => selectedProductIds.has(product.id))
        .forEach(product => {
            const title = product.title.replace(pattern, replaceWith)
            tasks.push(
                fetch(`/api/${shopId}/product/${product.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        title: title,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            )
        })

    Promise.all(tasks).then(() => {
        const output = replaceTitlePanel.querySelector('.output')
        output.innerHTML = ''
        var errors = 0

        tasks.forEach(task => {
            task.then(result => {
                if (!result.ok) {
                    errors++
                    console.error(result)
                }
            })
        })

        if (errors == 0) {
            output.innerHTML = 'Successfully replaced in titles'
        } else {
            output.innerHTML = `Encountered ${errors} errors while processing request, check console for more info`
        }
        reloadShop()
    })
}

function replaceDescription(event) {
    event.preventDefault()

    const shopId = shopSelect.value

    var pattern = document.getElementById('replaceDescriptionPattern').value
    const useRegex = document.getElementById('replaceDescriptionWithRegex').checked
    if (useRegex) {
        pattern = RegExp(pattern)
    }
    const replaceWith = document.getElementById('replaceDescriptionWith').value

    const selectedProductIds = getSelectedProductIds()
    const tasks = []
    products
        .filter(product => selectedProductIds.has(product.id))
        .forEach(product => {
            const description = product.description.replace(pattern, replaceWith)
            tasks.push(
                fetch(`/api/${shopId}/product/${product.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        description: description,
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
            )
        })

    Promise.all(tasks).then(() => {
        const output = replaceDescriptionPanel.querySelector('.output')
        output.innerHTML = ''
        var errors = 0

        tasks.forEach(task => {
            task.then(result => {
                if (!result.ok) {
                    errors++
                    console.error(result)
                }
            })
        })

        if (errors == 0) {
            output.innerHTML = 'Successfully replaced in descriptions'
        } else {
            output.innerHTML = `Encountered ${errors} errors while processing request, check console for more info`
        }
        reloadShop()
    })
}
