export type RouteConfig = {
  path: string;
  methods: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')[];
};

export const PUBLIC_ROUTES: Record<string, RouteConfig[]> = {
  AUTH: [
    { path: '/register', methods: ['POST'] },
    { path: '/login', methods: ['POST'] },
  ],
  EVENT: [
    { path: '/event', methods: ['GET'] },
  ],
};

export const ADMIN_ROUTES: Record<string, RouteConfig[]> = {
  AUTH: [
    { path: '/role', methods: ['PATCH'] }
  ],
};

export const OPERATOR_ROUTES: Record<string, RouteConfig[]> = {
  EVENT: [
    { path: '/event', methods: ['POST'] },
  ],
};
