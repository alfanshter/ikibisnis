/**
 * Domain Entity: Settings
 * App settings, user profile, appearance preferences.
 */

// ─── Store / App Settings ─────────────────────────────────────────────────────

export interface AppSettings {
  storeName:      string;
  storeTagline:   string;
  storeAddress:   string;
  storePhone:     string;
  storeEmail:     string;
  storeWebsite:   string;
  currency:       string;   // e.g. "IDR"
  logoInitial:    string;   // single letter shown in sidebar logo
  logoColor:      string;   // tailwind color key, e.g. "blue"
  timezone:       string;
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  name:     string;
  email:    string;
  role:     string;
  phone:    string;
  bio:      string;
  avatarInitial: string;
}

// ─── Appearance ───────────────────────────────────────────────────────────────

export type AccentColor = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
export type DateFormat  = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
export type Language    = 'id' | 'en';

export interface AppearanceSettings {
  accentColor:  AccentColor;
  dateFormat:   DateFormat;
  language:     Language;
  compactMode:  boolean;
}

// ─── Security ─────────────────────────────────────────────────────────────────

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword:     string;
  confirmPassword: string;
}

// ─── Aggregated ───────────────────────────────────────────────────────────────

export interface FullSettings {
  store:      AppSettings;
  profile:    UserProfile;
  appearance: AppearanceSettings;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const DEFAULT_STORE: AppSettings = {
  storeName:    'Nexus Admin',
  storeTagline: 'MANAGEMENT SYSTEM',
  storeAddress: 'Jl. Contoh No. 1, Jakarta',
  storePhone:   '+62 812-3456-7890',
  storeEmail:   'admin@nexus.id',
  storeWebsite: 'https://nexus.id',
  currency:     'IDR',
  logoInitial:  'N',
  logoColor:    'blue',
  timezone:     'Asia/Jakarta',
};

export const DEFAULT_PROFILE: UserProfile = {
  name:          'Alex Rivera',
  email:         'alex@nexus.id',
  role:          'Super Admin',
  phone:         '+62 812-3456-7890',
  bio:           'Administrator sistem Nexus.',
  avatarInitial: 'A',
};

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  accentColor: 'blue',
  dateFormat:  'DD/MM/YYYY',
  language:    'id',
  compactMode: false,
};
