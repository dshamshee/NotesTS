import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface CreateNoteData {
  title: string;
  content: string;
  caption: string;
}

export interface LoginData{
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AllNotes {
  _id: string;
  title: string;
  content: string;
  caption: string;
}

export const createNote = async (noteData: CreateNoteData) => {
  try {
    const response = await api.post('/note/create', noteData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create note');
    }
    throw error;
  }
};

export const login = async (loginData: LoginData) => {
  try {
    const response = await api.post('/user/login', loginData);
    if(response.data && response.data.accessToken){
      localStorage.setItem("token", response.data.accessToken);
      return response.data;
    }
    throw new Error(response.data?.message || 'Login failed - No access token received');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
    throw error;
  }
}

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const getAllNotes = async (): Promise<AllNotes[]> => {
  try {
    const response = await api.get('/note/getAllNotes');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get all notes');
    }
    throw error;
  }
};

export const register = async (registerData: RegisterData) => {
  try {
    const response = await api.post('/user/register', registerData);
    if(response.data && response.data.accessToken){
      localStorage.setItem("token", response.data.accessToken);
      return response.data;
    }
    throw new Error(response.data?.message || 'Registration failed');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
    throw error;
  }
};

export default api; 