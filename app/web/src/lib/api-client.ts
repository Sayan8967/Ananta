import { useAuthStore } from "@/lib/stores/auth-store";

// =============================================================================
// API Client - Typed fetch wrapper with auth header injection
// =============================================================================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api/v1";

interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClientError extends Error {
  status: number;
  code?: string;

  constructor({ message, status, code }: ApiError) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions extends Omit<RequestInit, "method" | "body"> {
  params?: Record<string, string | number | boolean | undefined>;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

function getAuthHeaders(): Record<string, string> {
  const token = useAuthStore.getState().token;
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorCode: string | undefined;

    try {
      const errorBody = await response.json();
      errorMessage = errorBody.message ?? errorBody.error ?? errorMessage;
      errorCode = errorBody.code;
    } catch {
      // Response body is not JSON
    }

    throw new ApiClientError({
      message: errorMessage,
      status: response.status,
      code: errorCode,
    });
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: RequestOptions
): Promise<T> {
  const { params, ...fetchOptions } = options ?? {};
  const url = buildUrl(path, params);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(fetchOptions.headers as Record<string, string>),
  };

  const response = await fetch(url, {
    ...fetchOptions,
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}

/**
 * Typed API client with automatic auth header injection.
 *
 * Usage:
 *   const patients = await apiClient.get<Patient[]>('/patients');
 *   const patient = await apiClient.post<Patient>('/patients', { name: 'John' });
 */
export const apiClient = {
  get<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("GET", path, undefined, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("POST", path, body, options);
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>("PUT", path, body, options);
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return request<T>("PATCH", path, body, options);
  },

  delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return request<T>("DELETE", path, undefined, options);
  },
};

export { ApiClientError };
export type { ApiError };
