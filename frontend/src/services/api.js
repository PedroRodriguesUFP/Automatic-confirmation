const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const api = {
  async getAppointments(businessId, date) {
    const params = date ? `?date=${date}` : ''
    const res = await fetch(`${BASE_URL}/appointments/${businessId}${params}`)
    return res.json()
  },

  async createAppointment(businessId, data) {
    const res = await fetch(`${BASE_URL}/appointments/${businessId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async cancelAppointment(id) {
    const res = await fetch(`${BASE_URL}/appointments/${id}/cancel`, {
      method: 'PATCH'
    })
    return res.json()
  },

  async getBusiness(slug) {
    const res = await fetch(`${BASE_URL}/business/${slug}`)
    return res.json()
  },

  async updateBusiness(id, data) {
    const res = await fetch(`${BASE_URL}/business/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async getMessages(businessId) {
    const res = await fetch(`${BASE_URL}/messages/${businessId}`)
    return res.json()
  }
}
