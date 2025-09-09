interface DeviceInfo {
  device_type: string;
  browser: string;
  operating_system: string;
}

interface SessionData {
  session_id: string;
  device_info: DeviceInfo;
  ip_address: string;
  created_at: string;
  last_activity: string;
  is_current: boolean;
}

interface DeviceLimitResponse {
  status: 'device_limit_exceeded' | 'success';
  current_sessions?: SessionData[];
  max_devices?: number;
  session_id?: string;
}

class ApiClient {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async getAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/token');
      if (!response.ok) {
        console.warn(`Token fetch failed: ${response.status}`);
        return null;
      }
      const data = await response.json();
      return data.accessToken;
    } catch (error) {
      console.warn('Failed to get access token:', error);
      return null;
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    try {
      const token = await this.getAccessToken();
      
      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
      };

      console.log(`Making request to: ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}:`, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    return this.request('/api/users/me');
  }

  async updateUser(data: any) {
    return this.request('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async testConnection() {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/test`);
      if (!response.ok) {
        throw new Error(`Connection test failed: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  // Session Management
  async createSession() {
    return this.request('/api/sessions/check-limit', { method: 'POST' });
  }

  async forceCreateSession(forceSessionId: string) {
    return this.request('/api/sessions/force', {
      method: 'POST',
      body: JSON.stringify({ force_session_id: forceSessionId }),
    });
  }

  async getUserSessions() {
    return this.request('/api/sessions/');
  }

  async terminateSession(sessionId: string) {
    return this.request(`/api/sessions/${sessionId}`, { method: 'DELETE' });
  }

  async sendSessionHeartbeat(sessionId: string) {
    return this.request('/api/sessions/heartbeat', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    });
  }

  async getSessionCount() {
    return this.request('/api/sessions/count');
  }
}

export const apiClient = new ApiClient();