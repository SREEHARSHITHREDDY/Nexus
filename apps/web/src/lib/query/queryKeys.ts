export const queryKeys = {
    // Auth
    me: ['auth', 'me'] as const,
  
    // Ideas
    ideas: {
      all:    (filters?: Record<string, unknown>) => ['ideas', filters] as const,
      detail: (id: string)                        => ['ideas', id]     as const,
    },
  
    // Decisions
    decisions: {
      all:    (filters?: Record<string, unknown>) => ['decisions', filters] as const,
      detail: (id: string)                        => ['decisions', id]     as const,
    },
  
    // Plans
    plans: {
      all:    (filters?: Record<string, unknown>) => ['plans', filters]          as const,
      detail: (id: string)                        => ['plans', id]               as const,
      tasks:  (planId: string)                    => ['plans', planId, 'tasks']  as const,
    },
  
    // Schedule
    schedule: {
      day:  (date: string)      => ['schedule', date]           as const,
      week: (weekStart: string) => ['schedule', 'week', weekStart] as const,
    },
  
    // Reflections
    reflections: {
      all:    ()         => ['reflections']        as const,
      latest: ()         => ['reflections', 'latest'] as const,
      detail: (id: string) => ['reflections', id]  as const,
    },
  
    // Analytics
    analytics: {
      score:   () => ['analytics', 'score']   as const,
      burnout: () => ['analytics', 'burnout'] as const,
    },
  
    // Memory
    memory: {
      search: (query: string) => ['memory', 'search', query] as const,
    },
  
    // Notifications
    notifications: {
      all:    () => ['notifications']           as const,
      unread: () => ['notifications', 'unread'] as const,
    },
  
    // Buddy
    buddy: {
      session: (sessionId: string) => ['buddy', 'session', sessionId] as const,
    },
  } as const;