import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/whatsapp-types';
import type { AdminUser, ChatTask } from '@/lib/whatsapp-types';
import crypto from 'crypto';

interface AdminLoginRequest {
  username: string;
  password: string;
}

interface CreateTaskRequest {
  title: string;
  description: string;
  assignedTo: string[];
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// Hash de contraseña simple (en producción usar bcrypt)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Token JWT simple (en producción usar jsonwebtoken)
function generateToken(adminId: string): string {
  return Buffer.from(`${adminId}:${Date.now()}`).toString('base64');
}

// Verificar token
function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [adminId] = decoded.split(':');
    return adminId;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'login') {
      const body = (await request.json()) as AdminLoginRequest;
      const { username, password } = body;

      if (!username || !password) {
        return NextResponse.json(
          { error: 'Usuario y contraseña requeridos' },
          { status: 400 }
        );
      }

      // Admin credentials (cambiar en producción)
      const defaultAdmin: AdminUser = {
        id: 'admin_001',
        username: 'admin-monopoly',
        passwordHash: hashPassword('Monopoly2024#Admin'),
        role: 'admin',
        permissions: [
          'view_users',
          'manage_tasks',
          'view_analytics',
          'manage_admins',
        ],
        createdAt: new Date(),
        isActive: true,
      };

      // Verificar credenciales
      if (
        username === defaultAdmin.username &&
        hashPassword(password) === defaultAdmin.passwordHash
      ) {
        const token = generateToken(defaultAdmin.id);

        return NextResponse.json(
          {
            success: true,
            token,
            admin: {
              id: defaultAdmin.id,
              username: defaultAdmin.username,
              role: defaultAdmin.role,
              permissions: defaultAdmin.permissions,
            },
            message: 'Inicio de sesión exitoso',
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 }
      );
    } else if (action === 'create-task') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const adminId = verifyToken(token);

      if (!adminId) {
        return NextResponse.json(
          { error: 'Token inválido' },
          { status: 401 }
        );
      }

      const body = (await request.json()) as CreateTaskRequest;
      const { title, description, assignedTo, priority, dueDate } = body;

      if (!title || !description || !assignedTo || assignedTo.length === 0) {
        return NextResponse.json(
          { error: 'Campos requeridos faltantes' },
          { status: 400 }
        );
      }

      const taskId = `task_${crypto.randomUUID().substring(0, 8)}`;

      const newTask: ChatTask = {
        id: taskId,
        title,
        description,
        assignedTo,
        status: 'pending',
        createdBy: adminId,
        createdAt: new Date(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      };

      dataStore.createTask(newTask);

      return NextResponse.json(
        {
          success: true,
          task: newTask,
          message: 'Tarea creada exitosamente',
        },
        { status: 201 }
      );
    } else if (action === 'get-users') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const adminId = verifyToken(token);

      if (!adminId) {
        return NextResponse.json(
          { error: 'Token inválido' },
          { status: 401 }
        );
      }

      const users = dataStore.getAllUsers();

      return NextResponse.json(
        {
          success: true,
          users: users.map((u) => ({
            id: u.id,
            phoneNumber: u.phoneNumber,
            isVerified: u.isVerified,
            createdAt: u.createdAt,
            lastMessage: u.lastMessage,
          })),
          totalUsers: users.length,
        },
        { status: 200 }
      );
    } else if (action === 'send-notification') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'No autorizado' },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const adminId = verifyToken(token);

      if (!adminId) {
        return NextResponse.json(
          { error: 'Token inválido' },
          { status: 401 }
        );
      }

      const body = (await request.json()) as {
        message: string;
        users?: string[];
      };

      const { message, users } = body;

      if (!message) {
        return NextResponse.json(
          { error: 'Mensaje requerido' },
          { status: 400 }
        );
      }

      // En producción, enviar notificaciones por WhatsApp a usuarios seleccionados
      console.log(
        `[Admin Notification] ${message} - To: ${users?.join(', ') || 'all'}`
      );

      return NextResponse.json(
        {
          success: true,
          notificationId: `notif_${crypto.randomUUID().substring(0, 8)}`,
          sentTo: users?.length || dataStore.getAllUsers().length,
          message: 'Notificación enviada',
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Acción no válida' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Admin API]:', error);
    return NextResponse.json(
      { error: 'Error al procesar solicitud' },
      { status: 500 }
    );
  }
}
