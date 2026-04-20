// Tipos para WhatsApp y autenticación
export interface WhatsAppUser {
  id: string;
  phoneNumber: string;
  verificationCode: string;
  isVerified: boolean;
  createdAt: Date;
  lastMessage?: Date;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

export interface AdminUser {
  id: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'moderator' | 'viewer';
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface ChatTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string[]; // Array de userIds
  status: 'pending' | 'in-progress' | 'completed';
  createdBy: string;
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface BotMessage {
  id: string;
  userId: string;
  content: string;
  role: 'user' | 'assistant';
  source: 'web' | 'whatsapp';
  timestamp: Date;
  metadata?: {
    isCommand?: boolean;
    commandType?: string;
    responseTime?: number;
  };
}

// En-memoria storage (reemplazar con BD real en producción)
export class DataStore {
  private whatsappUsers: Map<string, WhatsAppUser> = new Map();
  private adminUsers: Map<string, AdminUser> = new Map();
  private tasks: Map<string, ChatTask> = new Map();
  private messages: BotMessage[] = [];

  // WhatsApp User Methods
  getUserByPhone(phone: string): WhatsAppUser | undefined {
    return Array.from(this.whatsappUsers.values()).find(
      (u) => u.phoneNumber === phone
    );
  }

  addWhatsAppUser(user: WhatsAppUser): void {
    this.whatsappUsers.set(user.id, user);
  }

  verifyUser(userId: string, code: string): boolean {
    const user = this.whatsappUsers.get(userId);
    if (user && user.verificationCode === code) {
      user.isVerified = true;
      return true;
    }
    return false;
  }

  // Task Methods
  createTask(task: ChatTask): void {
    this.tasks.set(task.id, task);
  }

  getTasksForUser(userId: string): ChatTask[] {
    return Array.from(this.tasks.values()).filter((t) =>
      t.assignedTo.includes(userId)
    );
  }

  updateTask(taskId: string, updates: Partial<ChatTask>): void {
    const task = this.tasks.get(taskId);
    if (task) {
      Object.assign(task, updates);
    }
  }

  // Message Methods
  addMessage(message: BotMessage): void {
    this.messages.push(message);
  }

  getMessagesByUser(userId: string): BotMessage[] {
    return this.messages.filter((m) => m.userId === userId);
  }

  // Admin Methods
  createAdminUser(user: AdminUser): void {
    this.adminUsers.set(user.id, user);
  }

  getAdminByUsername(username: string): AdminUser | undefined {
    return Array.from(this.adminUsers.values()).find(
      (u) => u.username === username
    );
  }

  getAllUsers(): WhatsAppUser[] {
    return Array.from(this.whatsappUsers.values());
  }
}

// Singleton instance
export const dataStore = new DataStore();
