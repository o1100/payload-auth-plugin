export function getCallbackURL(baseURL: string, appType: 'admin' | 'app', provider: string): URL {
  const callback_url = new URL(baseURL)
  callback_url.pathname = `/api/${appType}/oauth/callback/${provider}`
  callback_url.search = ''
  return callback_url
}
