'use server'
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import { encrypt } from '@/lib/session';

export async function loginAdmin(data: FormData) {
  const email = data.get('username') as string;
  const pass = data.get('password') as string;

  if (!email || !pass) return { success: false, error: 'Credenciales inválidas' };

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    const isValid = await bcrypt.compare(pass, user.passwordHash);
    
    if (!isValid) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    const sessionData = {
      id: user.id,
      role: user.role,
      permissions: user.permissions,
      name: user.name,
    };

    const sessionToken = await encrypt(sessionData);

    (await cookies()).set('fyd_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Error al iniciar sesión' };
  }
}

export async function logoutAdmin() {
  (await cookies()).delete('fyd_admin_session');
}
