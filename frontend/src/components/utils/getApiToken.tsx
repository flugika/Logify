import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8080', // Set your API base URL here
});

// Add an interceptor to handle 401 or token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear the token and redirect to the sign-in page
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/signin'; // Or use a more React-friendly method like useNavigate
    }
    return Promise.reject(error);
  }
);

export default api;
