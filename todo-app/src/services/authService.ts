import { apiRequest } from '@/services/apiClient';
import type { ApiResult } from '@/types/api';
import type { LoginInput, LoginResponse } from '@/types/user';
import type { RefreshTokenResponse, RegisterInput, RegisterResponse } from '@/services/types';

export async function login(input: LoginInput): Promise<ApiResult<LoginResponse>> {
  return apiRequest<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data: input,
    skipAuth: true,
  });
}

export async function register(input: RegisterInput): Promise<ApiResult<RegisterResponse>> {
  return apiRequest<RegisterResponse>({
    url: '/auth/register',
    method: 'POST',
    data: input,
    skipAuth: true,
  });
}

export async function refreshToken(currentToken: string): Promise<ApiResult<RefreshTokenResponse>> {
  return apiRequest<RefreshTokenResponse>({
    url: '/auth/refresh',
    method: 'POST',
    data: { token: currentToken },
    skipAuth: true,
  });
}
