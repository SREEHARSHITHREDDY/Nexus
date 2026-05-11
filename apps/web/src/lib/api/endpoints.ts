export const ENDPOINTS = {
    auth: {
      register:  '/v1/auth/register',
      login:     '/v1/auth/login',
      logout:    '/v1/auth/logout',
      logoutAll: '/v1/auth/logout-all',
      refresh:   '/v1/auth/refresh',
      me:        '/v1/auth/me',
    },
  
    ideas: {
      list:   '/v1/ideas',
      create: '/v1/ideas',
      detail: (id: string) => `/v1/ideas/${id}`,
      update: (id: string) => `/v1/ideas/${id}`,
      delete: (id: string) => `/v1/ideas/${id}`,
    },
  
    decisions: {
      list:    '/v1/decisions',
      create:  '/v1/decisions',
      detail:  (id: string) => `/v1/decisions/${id}`,
      update:  (id: string) => `/v1/decisions/${id}`,
      outcome: (id: string) => `/v1/decisions/${id}/outcome`,
      delete:  (id: string) => `/v1/decisions/${id}`,
    },
  
    plans: {
      list:   '/v1/plans',
      create: '/v1/plans',
      detail: (id: string)     => `/v1/plans/${id}`,
      tasks:  (planId: string) => `/v1/plans/${planId}/tasks`,
    },
  
    schedule: {
      generate: '/v1/schedules/generate',
      day:      (date: string) => `/v1/schedules/${date}`,
      week:     '/v1/schedules/week',
    },
  
    buddy: {
      interact:   '/v1/buddy/interact',
      transcribe: '/v1/buddy/voice/transcribe',
      synthesize: '/v1/buddy/voice/synthesize',
    },
  
    reflections: {
      list:   '/v1/reflections',
      latest: '/v1/reflections/latest',
      run:    '/v1/reflections/run',
      detail: (id: string) => `/v1/reflections/${id}`,
    },
  
    memory: {
      search: '/v1/memory/search',
    },
  
    analytics: {
      score:   '/v1/analytics/execution-score',
      burnout: '/v1/analytics/burnout-risk',
    },
  
    notifications: {
      list:    '/v1/notifications',
      read:    (id: string) => `/v1/notifications/${id}/read`,
      readAll: '/v1/notifications/read-all',
    },
  } as const;