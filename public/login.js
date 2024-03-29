const error = document.getElementById('error')

fetch('/api')
    .then(res => res.json())
    .then(json => {
        if (json.loggedIn) {
            window.location.href = '/dashboard'
        }
    })

document.getElementById('loginForm').addEventListener('submit', event => {
    event.preventDefault()
    error.innerHTML = ''

    // Get access token
    const accessToken = document.getElementById('accessToken').value

    if (!accessToken) {
        error.innerHTML = 'Must provide access token'
        return
    }

    // Attempt login
    fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({
            accessToken: accessToken,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(async response => {
        if (response.ok) {
            // Redirect to dashboard
            window.location.href = '/dashboard'
        } else {
            error.innerHTML = 'An error occured: ' + (await response.text())
        }
    })
})
