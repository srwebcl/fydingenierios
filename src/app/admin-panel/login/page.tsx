'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { loginAdmin } from '@/actions/auth';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const res = await loginAdmin(formData);

    if (res.success) {
      router.push('/admin-panel');
    } else {
      setError(res.error || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light font-sans px-4">
      <div className="p-10 bg-brand-white shadow-xl rounded-2xl w-full max-w-md border border-brand-teal/20">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-xl shadow-sm inline-block">
              <Image 
                src="/logo.jpeg" 
                alt="F&D Ingenieros" 
                width={180} 
                height={180} 
                className="h-16 w-auto object-contain mx-auto"
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-heading text-brand-dark mb-2">Portal Administrativo</h1>
          <p className="text-brand-grey text-sm">Ingrese sus credenciales corporativas</p>
        </div>



        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm border border-red-200">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-2">Usuario</label>
            <input 
              name="username"
              type="text" 
              required 
              className="w-full border border-brand-grey/30 rounded px-4 py-3 focus:outline-none focus:border-brand-teal"
              placeholder="admin_fyd"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-dark mb-2">Contraseña</label>
            <input 
              name="password"
              type="password" 
              required 
              className="w-full border border-brand-grey/30 rounded px-4 py-3 focus:outline-none focus:border-brand-teal"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-dark text-brand-white font-bold py-3 rounded hover:bg-brand-teal transition-colors disabled:opacity-70 mt-4"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}
