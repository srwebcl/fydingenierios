'use server'

import { prisma } from '@/lib/db';
import * as bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        createdAt: true,
      }
    });
    return { success: true, users };
  } catch (error) {
    return { success: false, error: 'Error al obtener usuarios' };
  }
}

export async function createUser(data: FormData) {
  try {
    const email = data.get('email') as string;
    const name = data.get('name') as string;
    const password = data.get('password') as string;
    const role = data.get('role') as any || 'SELLER';
    
    // Extract permissions from formData checkboxes
    const permissions: string[] = [];
    const allPermissions = ['servicios', 'informes', 'cursos', 'diplomas', 'comercial', 'leads'];
    
    for (const p of allPermissions) {
      if (data.get(`perm_${p}`) === 'on') {
        permissions.push(p);
      }
    }

    if (!email || !name || !password) {
      return { success: false, error: 'Faltan campos obligatorios' };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: 'El correo ya está registrado' };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        permissions: role === 'ADMIN' ? ['ALL'] : permissions,
      }
    });

    revalidatePath('/admin-panel/usuarios');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al crear usuario' };
  }
}

export async function updateUser(id: string, data: FormData) {
  try {
    const email = data.get('email') as string;
    const name = data.get('name') as string;
    const password = data.get('password') as string;
    const role = data.get('role') as any || 'SELLER';
    
    const permissions: string[] = [];
    const allPermissions = ['servicios', 'informes', 'cursos', 'diplomas', 'comercial', 'leads'];
    
    for (const p of allPermissions) {
      if (data.get(`perm_${p}`) === 'on') {
        permissions.push(p);
      }
    }

    if (!email || !name) {
      return { success: false, error: 'Faltan campos obligatorios' };
    }

    const updateData: any = {
      email,
      name,
      role,
      permissions: role === 'ADMIN' ? ['ALL'] : permissions,
    };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    await prisma.user.update({
      where: { id },
      data: updateData
    });

    revalidatePath('/admin-panel/usuarios');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al actualizar usuario' };
  }
}

export async function deleteUser(id: string) {
  try {
    const count = await prisma.user.count({ where: { role: 'ADMIN' } });
    const user = await prisma.user.findUnique({ where: { id } });
    
    if (user?.role === 'ADMIN' && count <= 1) {
      return { success: false, error: 'No puedes eliminar al único administrador' };
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin-panel/usuarios');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al eliminar usuario' };
  }
}
