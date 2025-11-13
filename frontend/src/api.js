import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
})

// attach token from localStorage if present
const savedToken = typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('token') : null
if(savedToken){
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

export function setAuthToken(token){
  if(token){
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    if(typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem('token', token)
  }else{
    delete api.defaults.headers.common['Authorization']
    if(typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem('token')
  }
}

export async function login(credentials){
  return api.post('/auth/login', credentials)
}

export async function register(payload){
  return api.post('/auth/register', payload)
}

export async function getTransactions(params){
  return api.get('/transactions', { params })
}

export async function getSummary(params){
  return api.get('/reports/summary', { params })
}

export async function createTransaction(payload){
  return api.post('/transactions', payload)
}

export async function updateTransaction(id, payload){
  return api.put(`/transactions/${id}`, payload)
}

export async function deleteTransaction(id){
  return api.delete(`/transactions/${id}`)
}

export default api
