export type GenderOption = 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '';

export interface UserProfile {
  id?: string;
  fullName: string;
  age: number | string;
  gender: GenderOption;
  onboardingCompleted: boolean;
  createdAt: string;
}
