import { DatabaseManager } from '../../../core/database/database_manager';

export interface AdminSetupRequest {
  name: string;
  email: string;
  password: string;
  profile_picture_url?: string;
}

export interface AdminSetupResponse {
  success: boolean;
  message: string;
  admin?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export class AdminSetupService {
  constructor(private db: DatabaseManager) {}

  async createFirstAdmin(data: AdminSetupRequest): Promise<AdminSetupResponse> {
    try {
      // Check if admin already exists
      const adminExists = await this.db.systemSettings.isAdminCreated();
      
      if (adminExists) {
        return { success: false, message: 'Admin already exists' };
      }

      // Validate input
      const validation = this.validateAdminData(data);
      if (!validation.isValid) {
        return { success: false, message: validation.message };
      }

      // Create admin user
      const admin = await this.db.users.create({
        ...data,
        role: 'admin'
      });

      // Mark admin as created
      await this.db.systemSettings.markAdminCreated();

      return { 
        success: true, 
        message: 'Admin created successfully',
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      };
    } catch (error) {
      console.error('Error creating admin:', error);
      return { success: false, message: 'Failed to create admin' };
    }
  }

  async checkAdminSetup(): Promise<{ needsSetup: boolean }> {
    const adminExists = await this.db.systemSettings.isAdminCreated();
    return { needsSetup: !adminExists };
  }

  private validateAdminData(data: AdminSetupRequest): { isValid: boolean; message: string } {
    if (!data.name || data.name.trim().length < 2) {
      return { isValid: false, message: 'Name must be at least 2 characters long' };
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      return { isValid: false, message: 'Please provide a valid email address' };
    }

    if (!data.password || data.password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }

    return { isValid: true, message: 'Valid data' };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
