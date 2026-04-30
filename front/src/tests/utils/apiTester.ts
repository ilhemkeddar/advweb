import axios from 'axios';

const API_URL = process.env.VITE_API_URL || 'http://localhost:5000';

export class APITester {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = `${API_URL}/api`;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async get(endpoint: string, params?: any) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders(),
        params,
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 0,
      };
    }
  }

  async post(endpoint: string, data: any) {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: this.getHeaders(),
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 0,
      };
    }
  }

  async patch(endpoint: string, data: any) {
    try {
      const response = await axios.patch(`${this.baseURL}${endpoint}`, data, {
        headers: this.getHeaders(),
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 0,
      };
    }
  }

  async delete(endpoint: string) {
    try {
      const response = await axios.delete(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders(),
      });
      return { success: true, data: response.data, status: response.status };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status || 0,
      };
    }
  }
}

export const apiTester = new APITester();