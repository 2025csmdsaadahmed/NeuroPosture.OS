export type GenderOption = 'Male' | 'Female' | 'Other' | 'Prefer not to say' | '';

export interface UserProfile {
  fullName: string;
  age: number | string;
  gender: GenderOption;
  onboardingCompleted: boolean;
  createdAt: string;
}
