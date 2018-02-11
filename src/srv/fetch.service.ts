class FetchService {
  async fetch<T> (url: string, _opt: RequestInit = {}): Promise<T> {
    // avoid mutation
    const opt = { ..._opt} as any

    // Stringify body
    if (opt.body && typeof opt.body === 'object') {
      opt.body = JSON.stringify(opt.body)
    }

    // Content-type: application/json
    if (!opt.headers) opt.headers = {}
    if (!opt.headers['Content-Type']) {
      opt.headers['Content-Type'] = 'application/json'
    }

    const resp = await fetch(url, opt)
    if (!resp.ok) {
      const err = new Error(resp.statusText)
      ;(err as any).response = resp
      return Promise.reject(err)
    }

    return resp.json()
  }

  // convenience methods
  async get<T> (url: string, opt: RequestInit = {}): Promise<T> {
    opt['method'] = 'get'
    return this.fetch<T>(url, opt)
  }
  async post<T> (url: string, opt: RequestInit = {}): Promise<T> {
    opt['method'] = 'post'
    return this.fetch<T>(url, opt)
  }
  async put<T> (url: string, opt: RequestInit = {}): Promise<T> {
    opt['method'] = 'put'
    return this.fetch<T>(url, opt)
  }
  async patch<T> (url: string, opt: RequestInit = {}): Promise<T> {
    opt['method'] = 'patch'
    return this.fetch<T>(url, opt)
  }
  async delete<T> (url: string, opt: RequestInit = {}): Promise<T> {
    opt['method'] = 'delete'
    return this.fetch<T>(url, opt)
  }
}

export const fetchService = new FetchService()
