import { env } from '@/config/constants';

const BASE_AUTH_PREFIX = `${env.BASE_API_URL}/auth`;
const apiAuthRoutes = {
  login: `${BASE_AUTH_PREFIX}/login/`,
  currentUser: `${BASE_AUTH_PREFIX}/user/`,
  register: `${BASE_AUTH_PREFIX}/register/`,
  logout: `${BASE_AUTH_PREFIX}/logout/`,
  refresh: `${BASE_AUTH_PREFIX}/token/refresh/`,
  verify: `${BASE_AUTH_PREFIX}/token/verify/`,
};

const accountRoutes = {
  base: `${env.BASE_API_URL}/accounts/`,
  actions: (id: string) => `${env.BASE_API_URL}/accounts/${id}/`,
  profile: (id: string) => `${env.BASE_API_URL}/accounts/profile/${id}/`,
};

export const apiRoutes = {
  auth: { ...apiAuthRoutes },
  account: { ...accountRoutes },
};
