import api from './axios'

/**
 * Login user dengan email dan password.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ token: string, user: object }>}
 */
export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials)
  return response.data
}

/**
 * Logout — hapus token dari storage.
 */
export const logoutUser = () => {
  localStorage.removeItem('token')
}
