'use client';

import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '@/actions/usuarios';
import { Plus, Edit2, Trash2, Shield, User, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: Date;
};

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  
  const [role, setRole] = useState('SELLER');

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getUsers();
    if (res.success && res.users) {
      setUsers(res.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openNew = () => {
    setEditingUser(null);
    setRole('SELLER');
    setShowModal(true);
  };

  const openEdit = (u: UserData) => {
    setEditingUser(u);
    setRole(u.role);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const loadingToast = toast.loading('Eliminando...');
      const res = await deleteUser(id);
      toast.dismiss(loadingToast);
      
      if (res.success) {
        toast.success('Usuario eliminado');
        fetchUsers();
      } else {
        toast.error(res.error || 'Error al eliminar');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const loadingToast = toast.loading(editingUser ? 'Actualizando...' : 'Creando...');
    const res = editingUser 
      ? await updateUser(editingUser.id, formData)
      : await createUser(formData);
      
    toast.dismiss(loadingToast);

    if (res.success) {
      toast.success(editingUser ? 'Usuario actualizado' : 'Usuario creado');
      setShowModal(false);
      fetchUsers();
    } else {
      toast.error(res.error || 'Error al procesar la solicitud');
    }
  };

  const permissionList = [
    { id: 'comercial', label: 'Comercial (Cotizaciones)' },
    { id: 'leads', label: 'Bandeja de Leads' },
    { id: 'servicios', label: 'Servicios Web' },
    { id: 'informes', label: 'Informes Técnicos' },
    { id: 'cursos', label: 'Cursos (Capacitaciones)' },
    { id: 'diplomas', label: 'Diplomas' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-brand-light">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark flex items-center gap-2">
            <Users size={28} className="text-brand-teal" />
            Gestión de Usuarios
          </h1>
          <p className="text-brand-grey mt-1">Crea y administra los perfiles de tu equipo.</p>
        </div>
        <button 
          onClick={openNew}
          className="bg-brand-teal text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-dark transition-colors"
        >
          <Plus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-brand-light overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-brand-grey">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-brand-grey">No hay usuarios registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-light/30 border-b border-brand-light">
                  <th className="p-4 text-sm font-bold text-brand-dark">Nombre</th>
                  <th className="p-4 text-sm font-bold text-brand-dark">Email</th>
                  <th className="p-4 text-sm font-bold text-brand-dark">Rol</th>
                  <th className="p-4 text-sm font-bold text-brand-dark">Permisos Extras</th>
                  <th className="p-4 text-sm font-bold text-brand-dark text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-brand-light/10 transition-colors">
                    <td className="p-4 font-medium text-brand-dark">{u.name}</td>
                    <td className="p-4 text-sm text-brand-grey">{u.email}</td>
                    <td className="p-4">
                      {u.role === 'ADMIN' ? (
                        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                          <Shield size={12} /> Administrador
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                          <User size={12} /> Vendedor
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-brand-grey">
                      {u.role === 'ADMIN' ? 'Todos' : u.permissions.join(', ') || 'Ninguno'}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(u)} className="p-2 text-brand-teal hover:bg-brand-light rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal CRUD */}
      {showModal && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-brand-light">
              <h3 className="font-bold text-lg text-brand-dark">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-brand-grey hover:bg-brand-light rounded p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Nombre Completo</label>
                <input required type="text" name="name" defaultValue={editingUser?.name} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Correo Electrónico</label>
                <input required type="email" name="email" defaultValue={editingUser?.email} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:border-brand-teal focus:outline-none" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">
                  Contraseña {editingUser && <span className="text-brand-grey text-xs font-normal">(Dejar en blanco para no cambiar)</span>}
                </label>
                <input required={!editingUser} type="password" name="password" minLength={6} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:border-brand-teal focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-dark mb-1">Rol</label>
                <select name="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-brand-grey/30 rounded px-3 py-2 text-sm focus:border-brand-teal focus:outline-none bg-white">
                  <option value="SELLER">Vendedor (Acceso Restringido)</option>
                  <option value="ADMIN">Administrador (Acceso Total)</option>
                </select>
              </div>

              {role === 'SELLER' && (
                <div className="pt-2 border-t border-brand-light mt-4">
                  <label className="block text-sm font-bold text-brand-dark mb-2">Permisos (Módulos a los que puede acceder)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissionList.map(p => (
                      <label key={p.id} className="flex items-center gap-2 text-sm text-brand-dark bg-brand-light/30 p-2 rounded cursor-pointer hover:bg-brand-light/50">
                        <input 
                          type="checkbox" 
                          name={`perm_${p.id}`} 
                          defaultChecked={editingUser?.permissions?.includes(p.id)}
                          className="accent-brand-teal"
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-brand-light flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-brand-grey hover:bg-brand-light rounded font-medium">
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 bg-brand-teal text-white rounded font-bold hover:bg-brand-dark transition-colors">
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
