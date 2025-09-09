import { useUser } from '@auth0/nextjs-auth0/client';

class SimpleApiClient {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  private async request(endpoint: string, options: RequestInit = {}, user?: any) {
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(user && {
          'x-user-id': user.sub,
          'x-user-email': user.email || '',
          'x-user-name': user.name || ''
        }),
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return response.json();
  }

  async getCurrentUser(user: any) {
    return this.request('/api/users/me', {}, user);
  }

  async updateUser(data: any, user: any) {
    return this.request('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }, user);
  }

  async createSession(user: any) {
    return this.request('/api/sessions/create', { method: 'POST' }, user);
  }

  async forceCreateSession(sessionId: string, user: any) {
    return this.request('/api/sessions/force-create', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    }, user);
  }

  async validateSession(user: any) {
    return this.request('/api/session/validate', {}, user);
  }
}

export const simpleApiClient = new SimpleApiClient();