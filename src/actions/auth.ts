'use server'
import { cookies } from 'next/headers';

export async function loginAdmin(data: FormData) {
  const user = data.get('username');
  const pass = data.get('password');

  const envUser = process.env.ADMIN_USER || 'admin';
  const envPass = process.env.ADMIN_PASSWORD || 'admin12345';

  if (user === envUser && pass === envPass) {
    (await cookies()).set('fyd_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return { success: true };
  }
  return { success: false, error: 'Credenciales inválidas' };
}
