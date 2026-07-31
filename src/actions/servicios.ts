'use server'

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';

export async function uploadServiceImage(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'No se envió ningún archivo' };

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('Falta el token BLOB_READ_WRITE_TOKEN');
      return { success: false, error: 'Configuración del CDN incompleta' };
    }

    const blob = await put(`servicios/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token,
    });

    return { success: true, url: blob.url };
  } catch (error: any) {
    console.error('Error completo al subir imagen a Vercel Blob:', error);
    return { success: false, error: `Error CDN: ${error.message}` };
  }
}

export async function createService(data: {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  benefits: string[];
  deliverables: string[];
  normatives: string[];
}) {
  try {
    const service = await prisma.service.create({
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        imageUrl: data.imageUrl,
        benefits: data.benefits,
        deliverables: data.deliverables,
        normatives: data.normatives,
      }
    });
    
    revalidatePath('/servicios');
    revalidatePath('/admin-panel/servicios');
    
    return { success: true, service };
  } catch (error: any) {
    console.error('Error creating service:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Ya existe un servicio con ese slug' };
    }
    return { success: false, error: error.message || 'Error al crear el servicio' };
  }
}

export async function updateService(slug: string, data: {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl?: string;
  benefits: string[];
  deliverables: string[];
  normatives: string[];
}) {
  try {
    const service = await prisma.service.update({
      where: { slug },
      data: {
        title: data.title,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        imageUrl: data.imageUrl,
        benefits: data.benefits,
        deliverables: data.deliverables,
        normatives: data.normatives,
      }
    });

    revalidatePath('/servicios');
    revalidatePath(`/servicios/${slug}`);
    if (slug !== data.slug) {
      revalidatePath(`/servicios/${data.slug}`);
    }
    revalidatePath('/admin-panel/servicios');
    
    return { success: true, service };
  } catch (error: any) {
    console.error('Error updating service:', error);
    if (error.code === 'P2002') {
      return { success: false, error: 'Ya existe otro servicio con ese slug' };
    }
    return { success: false, error: error.message || 'Error al actualizar el servicio' };
  }
}

export async function deleteService(slug: string) {
  try {
    await prisma.service.delete({
      where: { slug }
    });
    
    revalidatePath('/servicios');
    revalidatePath('/admin-panel/servicios');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting service:', error);
    return { success: false, error: error.message || 'Error al eliminar el servicio' };
  }
}
