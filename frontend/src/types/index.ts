export interface Team {
  id: number;
  name: string;
  type: TeamType;
  organization_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface SelectOption {
  value: string;
  label: string;
} 

export interface UserFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  organization_id: string;
  team_id: string;
}

export type UserRole = 'admin' | 'dispatcher' | 'responder';

export type TeamType = 'fire' | 'medical' | 'rescue' | 'hazmat';