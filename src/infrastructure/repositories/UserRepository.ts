/**
 * Infrastructure: User Repository Implementation
 * Handles user data fetching - uses mock data (replace with real API)
 */

import {
  User,
  UserCollection,
  UserPagination,
  CreateUserDTO,
  UpdateUserDTO,
  RolePermissions,
  UserRole,
  UserAvatar
} from '@/src/domain/entities/User';
import { IUserRepository } from '@/src/domain/repositories/IUserRepository';

const AVATAR_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500'];

const getAvatarColor = (name: string): string => {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const makeAvatar = (name: string): UserAvatar => ({
  initials: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
  bgColor: getAvatarColor(name)
});

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex@admin.co',
    role: 'Admin',
    status: 'Active',
    lastLogin: new Date(Date.now() - 2 * 60 * 1000),
    avatar: { initials: 'AR', bgColor: 'bg-blue-500' }
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 's.chen@corp.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: new Date(Date.now() - 60 * 60 * 1000),
    avatar: { initials: 'SC', bgColor: 'bg-purple-500' }
  },
  {
    id: '3',
    name: 'James Wilson',
    email: 'james@team.net',
    role: 'Staff',
    status: 'Inactive',
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000),
    avatar: { initials: 'JW', bgColor: 'bg-green-500' }
  },
  {
    id: '4',
    name: 'Maria Garcia',
    email: 'm.garcia@staff.com',
    role: 'Staff',
    status: 'Active',
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    avatar: { initials: 'MG', bgColor: 'bg-orange-500' }
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'd.kim@corp.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000),
    avatar: { initials: 'DK', bgColor: 'bg-teal-500' }
  },
  {
    id: '6',
    name: 'Lisa Park',
    email: 'l.park@team.net',
    role: 'Staff',
    status: 'Active',
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    avatar: { initials: 'LP', bgColor: 'bg-pink-500' }
  },
  {
    id: '7',
    name: 'Tom Brown',
    email: 't.brown@staff.com',
    role: 'Staff',
    status: 'Inactive',
    lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    avatar: { initials: 'TB', bgColor: 'bg-blue-500' }
  },
  {
    id: '8',
    name: 'Nina Patel',
    email: 'n.patel@corp.com',
    role: 'Manager',
    status: 'Active',
    lastLogin: new Date(Date.now() - 30 * 60 * 1000),
    avatar: { initials: 'NP', bgColor: 'bg-purple-500' }
  }
];

const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  Admin: {
    role: 'Admin',
    modules: [
      { module: 'project_access', label: 'Project Access', icon: 'briefcase', permissions: { read: true, write: true, delete: true } },
      { module: 'financial_reports', label: 'Financial Reports', icon: 'dollar', permissions: { read: true, write: true, delete: true } },
      { module: 'user_management', label: 'User Management', icon: 'users', permissions: { read: true, write: true, delete: true } }
    ]
  },
  Manager: {
    role: 'Manager',
    modules: [
      { module: 'project_access', label: 'Project Access', icon: 'briefcase', permissions: { read: true, write: true, delete: false } },
      { module: 'financial_reports', label: 'Financial Reports', icon: 'dollar', permissions: { read: true, write: false, delete: false } },
      { module: 'user_management', label: 'User Management', icon: 'users', permissions: { read: false, write: false, delete: false } }
    ]
  },
  Staff: {
    role: 'Staff',
    modules: [
      { module: 'project_access', label: 'Project Access', icon: 'briefcase', permissions: { read: true, write: false, delete: false } },
      { module: 'financial_reports', label: 'Financial Reports', icon: 'dollar', permissions: { read: false, write: false, delete: false } },
      { module: 'user_management', label: 'User Management', icon: 'users', permissions: { read: false, write: false, delete: false } }
    ]
  }
};

// In-memory store for demo (mutable copy)
let usersStore: User[] = [...MOCK_USERS];
const permissionsStore: Record<UserRole, RolePermissions> = JSON.parse(
  JSON.stringify(DEFAULT_ROLE_PERMISSIONS)
);

export class UserRepository implements IUserRepository {
  async getUsers(page: number = 1, perPage: number = 4): Promise<UserCollection> {
    await new Promise(r => setTimeout(r, 300));
    const start = (page - 1) * perPage;
    const paginatedUsers = usersStore.slice(start, start + perPage);
    const pagination: UserPagination = {
      currentPage: page,
      totalPages: Math.ceil(usersStore.length / perPage),
      totalUsers: usersStore.length,
      perPage
    };
    return new UserCollection(paginatedUsers, pagination);
  }

  async getUserById(id: string): Promise<User | null> {
    await new Promise(r => setTimeout(r, 100));
    return usersStore.find(u => u.id === id) ?? null;
  }

  async createUser(dto: CreateUserDTO): Promise<User> {
    await new Promise(r => setTimeout(r, 400));
    const newUser: User = {
      id: String(Date.now()),
      name: dto.name,
      email: dto.email,
      role: dto.role,
      status: 'Active',
      lastLogin: new Date(),
      avatar: makeAvatar(dto.name)
    };
    usersStore = [newUser, ...usersStore];
    return newUser;
  }

  async updateUser(dto: UpdateUserDTO): Promise<User> {
    await new Promise(r => setTimeout(r, 300));
    usersStore = usersStore.map(u =>
      u.id === dto.id ? { ...u, ...dto } : u
    );
    const updated = usersStore.find(u => u.id === dto.id);
    if (!updated) throw new Error('User not found');
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    usersStore = usersStore.filter(u => u.id !== id);
  }

  async getRolePermissions(role: UserRole): Promise<RolePermissions> {
    await new Promise(r => setTimeout(r, 200));
    return JSON.parse(JSON.stringify(permissionsStore[role]));
  }

  async updateRolePermissions(permissions: RolePermissions): Promise<RolePermissions> {
    await new Promise(r => setTimeout(r, 300));
    permissionsStore[permissions.role] = JSON.parse(JSON.stringify(permissions));
    return permissionsStore[permissions.role];
  }
}
