// The ONLY Axios instance. baseURL from config/env, withCredentials, partner header, error interceptor.
import axios from 'axios';
import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { isMockingEnabled, startMocks } from '@/mocks/start';
import { useAssistanceStore } from '@/store/assistance.store';
import { ENDPOINTS } from './endpoints';
import { normalizeError } from './errors';

const IDENTIFY_PATHS: readonly string[] = Object.values(ENDPOINTS.identify);

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  // The assistance session is an httpOnly cookie set on identify (rules.md §7).
  withCredentials: true,
  timeout: 30_000,
  headers: { Accept: 'application/json', 'X-Partner-Id': env.partnerId },
});

// Development only: hold requests until the MSW worker is ready (no-op otherwise).
apiClient.interceptors.request.use(async (config) => {
  if (isMockingEnabled) await startMocks();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = normalizeError(error);
    const requestPath = axios.isAxiosError(error) ? error.config?.url : undefined;

    // Expired session: start over. A full page load also drops the query cache (rules.md §10).
    if (apiError.status === 401 && requestPath && !IDENTIFY_PATHS.includes(requestPath)) {
      useAssistanceStore.getState().reset();
      if (typeof window !== 'undefined') window.location.assign(ROUTES.WELCOME);
    }

    return Promise.reject(apiError);
  },
);
