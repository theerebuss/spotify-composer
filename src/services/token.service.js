const authTokenKey = "spotifyAuthToken"

export function tokenIsEmpty(token) {
    return token == null || Object.keys(token).length === 0
}

export function getToken() {
    return JSON.parse(localStorage.getItem(authTokenKey))
}

export function setToken(token) {
    if (!tokenIsEmpty(token)) {
        localStorage.setItem(authTokenKey, JSON.stringify(token))
    } else {
        localStorage.setItem(authTokenKey, null)
    }
}

export function clearToken() {
    setToken()

}