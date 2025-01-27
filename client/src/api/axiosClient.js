import axios from 'axios'
import queryString from 'query-string'

const baseUrl = 'http://127.0.0.1:5000/api/v1/'
const getToken = () => localStorage.getItem('token')

const axiosClient = axios.create({
  baseURL: baseUrl,
  paramsSerializer: params => queryString.stringify({ params })
})

axiosClient.interceptors.request.use(async config => {
  return {
    ...config,
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${getToken()}`
    }
  }
})

axiosClient.interceptors.response.use(
  (response) => response?.data ?? response,
  (err) => {
    console.error('Axios Error:', err); // Log full error details
    if (!err.response) throw new Error('Network error or server not reachable');
    throw err.response; // Throw the response object for better error handling
  }
);

export default axiosClient