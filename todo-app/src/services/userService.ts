import { apiRequest } from '@/services/apiClient';
import type { ApiResult } from '@/types/api';
import type { IUser, UserSettings } from '@/types/user';

export async function fetchProfile(userId: number): Promise<ApiResult<IUser>> {
  return apiRequest<IUser>({
    url: `/users/${userId}`,
    method: 'GET',
  });
}

export async function updateProfile(
  userId: number,
  patch: Partial<IUser>,
): Promise<ApiResult<IUser>> {
  return apiRequest<IUser>({
    url: `/users/${userId}`,
    method: 'PATCH',
    data: patch,
  });
}

export async function updateUserSettings(
  userId: number,
  settings: Partial<UserSettings>,
): Promise<ApiResult<UserSettings>> {
  return apiRequest<UserSettings>({
    url: `/users/${userId}/settings`,
    method: 'PATCH',
    data: settings,
  });
}
