import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('access_token');
    } catch {
      return null;
    }
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;
    let url = `${this.baseUrl}${path}`;

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += `?${searchParams.toString()}`;
    }

    const token = await this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...init,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new ApiError(response.status, error.message || 'Request failed', error);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }

  async uploadFile<T>(path: string, file: { uri: string; name: string; type: string }): Promise<T> {
    const token = await this.getToken();
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new ApiError(response.status, error.message || 'Upload failed', error);
    }

    return response.json();
  }
}

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Domain-specific API methods
export const patientApi = {
  getProfile: () => apiClient.get<any>('/patients/me'),
  updateProfile: (data: any) => apiClient.put<any>('/patients/me', data),
  getConditions: (patientId: string) => apiClient.get<any>(`/patients/${patientId}/conditions`),
  createCondition: (patientId: string, data: any) => apiClient.post<any>(`/patients/${patientId}/conditions`, data),
  getMedications: (patientId: string) => apiClient.get<any>(`/patients/${patientId}/medications`),
  createMedication: (patientId: string, data: any) => apiClient.post<any>(`/patients/${patientId}/medications`, data),
  getAllergies: (patientId: string) => apiClient.get<any>(`/patients/${patientId}/allergies`),
  createAllergy: (patientId: string, data: any) => apiClient.post<any>(`/patients/${patientId}/allergies`, data),
  getImmunizations: (patientId: string) => apiClient.get<any>(`/patients/${patientId}/immunizations`),
  createImmunization: (patientId: string, data: any) => apiClient.post<any>(`/patients/${patientId}/immunizations`, data),
  getTimeline: (patientId: string, params?: Record<string, string>) =>
    apiClient.get<any>(`/patients/${patientId}/timeline`, params),
  getPrescriptions: (patientId: string) => apiClient.get<any>(`/patients/${patientId}/prescriptions`),
  uploadPrescription: (patientId: string, file: { uri: string; name: string; type: string }) =>
    apiClient.uploadFile<any>(`/patients/${patientId}/prescriptions/upload`, file),
  confirmPrescription: (patientId: string, prescriptionId: string, data: any) =>
    apiClient.post<any>(`/patients/${patientId}/prescriptions/${prescriptionId}/confirm`, data),
};

export const emergencyApi = {
  getCard: () => apiClient.get<any>('/emergency/cards/me'),
  generateCard: () => apiClient.post<any>('/emergency/cards'),
  getCardByCode: (code: string) => apiClient.get<any>(`/emergency/cards/${code}`),
};

export const consentApi = {
  getConsents: () => apiClient.get<any>('/consents'),
  updateConsent: (id: string, data: any) => apiClient.put<any>(`/consents/${id}`, data),
  createConsent: (data: any) => apiClient.post<any>('/consents', data),
};
