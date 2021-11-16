const ID_TOKEN_KEY = 'token'

export const getToken = () => {
  return window.localStorage.getItem(ID_TOKEN_KEY)
}

export const saveToken = token => {
  window.localStorage.setItem(ID_TOKEN_KEY, token)
}

export const destroyToken = () => {
  window.localStorage.removeItem(ID_TOKEN_KEY)
}

export const getLink = () => {
  return process.env.VUE_APP_API_END_POINT
}

export default { getToken, saveToken, destroyToken, getLink }