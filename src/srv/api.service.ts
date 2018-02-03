
class ApiService {
  async getSchema (): Promise<any> {
    const r = await fetch('http://localhost:3000/schema')
    return r.json()
  }
}

export const apiService = new ApiService()
