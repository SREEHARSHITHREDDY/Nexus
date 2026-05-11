import { UserPlan } from '../enums/user-plan.enum';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  timezone: string;
  plan: UserPlan;
  emailVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UserProfile {
  id: string;
  userId: string;
  deepWorkHours: number[];
  avgTaskDurationAccuracy: number;
  energyPatternByDay: Record<string, number>;
  preferredSessionDuration: number;
  bufferPercentage: number;
  behavioralModel: Record<string, unknown>;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  reflectionDay: number;
  reflectionHour: number;
  notificationsEnabled: boolean;
  voiceEnabled: boolean;
  voiceId: string | null;
  theme: 'light' | 'dark' | 'system';
  weekStartsOn: 0 | 1;
  updatedAt: Date;
}

export type CreateUserInput = Pick<User, 'email' | 'name' | 'timezone'> & {
  password?: string;
  provider?: 'google' | 'email';
  providerId?: string;
};

export type UpdateUserInput = Partial<Pick<User, 'name' | 'timezone' | 'avatarUrl'>>;