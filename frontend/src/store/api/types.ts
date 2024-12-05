// Auth & User Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface UserFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AdminRegisterData extends UserFormData {
  organization_id: number;
}

export interface UserRegisterData extends UserFormData {
  organization_id?: number;
  team_id?: number;
}

export type UserUpdateData = Partial<Omit<UserFormData, 'password'>>;

// Organization Types
export interface Organization {
  id: number;
  name: string;
  type: OrganizationType;
  description?: string;
  location?: string;
  visibility: OrganizationVisibility;
  verification_status: boolean;
  created_by_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface OrganizationDetail extends Organization {
  members: Member[];
  teams: Team[];
  member_count: number;
  team_count: number;
  resource_count: number;
  active_incidents: number;
}

export interface OrganizationFormData {
  name: string;
  type: OrganizationType;
  description?: string;
  location?: string;
  visibility: OrganizationVisibility;
}

export interface Member {
  id: number;
  user_id: number;
  organization_id: number;
  role: OrganizationRole;
  status: MembershipStatus;
  join_date: string;
  last_active: string | null;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

// Team Types
export interface Team {
  id: number;
  name: string;
  type: TeamType;
  description?: string;
  geographic_area?: string;
  status: TeamStatus;
  organization_id: number;
  created_at: string;
  updated_at: string | null;
}

export interface TeamDetail extends Team {
  members: TeamMember[];
  resources: Resource[];
  member_count: number;
  active_incidents: number;
  assigned_resources: number;
  organization_name: string;
}

export interface TeamMember {
  id: number;
  user_id: number;
  team_id: number;
  role: TeamRole;
  join_date: string;
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface TeamMembership {
  id: number;
  team_id: number;
  user_id: number;
  role: TeamRole;
  join_date: string;
}

// Resource Types
export interface Resource {
  id: number;
  name: string;
  type: ResourceType;
  description?: string;
  quantity: number;
  status: ResourceStatus;
  organization_id: number;
  team_id?: number;
  created_at: string;
  updated_at: string | null;
}

// Incident Types
export interface Incident {
  id: number;
  title: string;
  description?: string;
  type: IncidentType;
  priority: IncidentPriority;
  status: IncidentStatus;
  latitude?: number;
  longitude?: number;
  location_description?: string;
  organization_id: number;
  created_by_id: number;
  assigned_team_id?: number;
  created_at: string;
  updated_at: string | null;
  resolved_at: string | null;
}

// Enums
export enum OrganizationType {
  EMERGENCY_RESPONSE = "emergency_response",
  RESOURCE_DISTRIBUTION = "resource_distribution",
  VOLUNTEER_COORDINATION = "volunteer_coordination",
  DISASTER_RELIEF = "disaster_relief"
}

export enum OrganizationVisibility {
  PUBLIC = "public",
  PRIVATE = "private"
}

export enum OrganizationRole {
  ADMIN = "admin",
  MEMBER = "member"
}

export enum TeamRole {
  LEADER = "leader",
  DISPATCHER = "dispatcher",
  MEMBER = "member"
}

export enum TeamType {
  RESPONSE = "response",
  MEDICAL = "medical",
  RESCUE = "rescue",
  LOGISTICS = "logistics",
  SUPPORT = "support"
}

export enum TeamStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  STANDBY = "standby"
}

export enum ResourceType {
  VEHICLE = "vehicle",
  EQUIPMENT = "equipment",
  MEDICAL = "medical",
  SUPPLY = "supply",
  OTHER = "other"
}

export enum ResourceStatus {
  AVAILABLE = "available",
  IN_USE = "in_use",
  OUT_OF_SERVICE = "out_of_service",
  RESERVED = "reserved"
}

export enum IncidentType {
  EMERGENCY = "emergency",
  RESOURCE_REQUEST = "resource_request",
  STATUS_UPDATE = "status_update"
}

export enum IncidentPriority {
  CRITICAL = "critical",
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low"
}

export enum IncidentStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed"
}

export enum MembershipStatus {
  ACTIVE = "active",
  PENDING = "pending",
  DENIED = "denied"
}

// Add these interfaces to types.ts
export interface StatusChangeMetadata {
  old_status: IncidentStatus;
  new_status: IncidentStatus;
  reason?: string;
}

export interface ResourceUpdateMetadata {
  resource_id: number;
  resource_name: string;
  action: 'assigned' | 'returned';
  quantity?: number;
}

export type UpdateMetadata = StatusChangeMetadata | ResourceUpdateMetadata | Record<string, string | number | boolean>;

// Add these to the existing types.ts file

export interface ResourceAssignment {
  id: number;
  resource_id: number;
  incident_id: number;
  quantity: number;
  notes?: string;
  assigned_at: string;
  returned_at?: string;
  assigned_by_id: number;
}

export interface ResourceHistory {
  id: number;
  resource_id: number;
  action: 'created' | 'updated' | 'assigned' | 'returned' | 'status_changed';
  metadata: {
    old_value?: string | number;
    new_value?: string | number;
    notes?: string;
    incident_id?: number;
    team_id?: number;
  };
  created_at: string;
  user_id: number;
}