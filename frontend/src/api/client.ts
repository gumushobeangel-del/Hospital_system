import { UserRole } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL || "";

export interface HealthResponse {
  status: string;
  latencyMs: number;
}

export interface ApiUserResponse {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export async function checkApiHealth(): Promise<HealthResponse> {
  const start = performance.now();
  const response = await fetch(`${BASE_URL}/health`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  const latencyMs = Math.round(performance.now() - start);

  if (!response.ok) {
    throw new Error(`API health check failed with status ${response.status}`);
  }
  const data = await response.json();
  return { status: data.status, latencyMs };
}

export async function loginUser(email: string, password: string): Promise<ApiUserResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Authentication failed (${response.status})`);
  }
  return response.json();
}

export async function logoutUser(): Promise<void> {
  await fetch(`${BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
}

export async function fetchCurrentUser(): Promise<ApiUserResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchUsers(): Promise<ApiUserResponse[]> {
  const response = await fetch(`${BASE_URL}/api/v1/users`, {
    method: "GET",
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to fetch users (${response.status})`);
  }
  return response.json();
}

export async function createBackendUser(payload: {
  email: string;
  password: string;
  role: UserRole;
}): Promise<ApiUserResponse> {
  const response = await fetch(`${BASE_URL}/api/v1/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to create user (${response.status})`);
  }
  return response.json();
}
