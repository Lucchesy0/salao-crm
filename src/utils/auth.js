export const USER_ROLES = {
  ADMIN: 'admin',
  CABELEIREIRA: 'cabeleireira',
  AUXILIAR: 'auxiliar',
  CLIENTE: 'cliente'
};

export const ROLE_LABELS = {
  admin: 'Administrador',
  cabeleireira: 'Cabeleireira',
  auxiliar: 'Auxiliar',
  cliente: 'Cliente'
};

export const ROLE_COLORS = {
  admin: 'blue',
  cabeleireira: 'pink',
  auxiliar: 'green',
  cliente: 'purple'
};

// Definir permissões por role
export const ROLE_PERMISSIONS = {
  admin: [
    'view_dashboard',
    'view_auxiliares',
    'edit_auxiliares',
    'view_cabeleireiras',
    'edit_cabeleireiras',
    'view_clientes',
    'edit_clientes',
    'view_servicos',
    'edit_servicos',
    'view_reports',
    'manage_users'
  ],
  cabeleireira: [
    'view_dashboard',
    'view_clientes',
    'view_servicos',
    'view_agendamentos',
    'edit_agendamentos'
  ],
  auxiliar: [
    'view_dashboard',
    'view_clientes',
    'view_servicos'
  ],
  cliente: [
    'view_perfil',
    'view_agendamentos',
    'agendar_servicos'
  ]
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('salao_user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem('salao_user', JSON.stringify(user));
};

export const clearStoredUser = () => {
  localStorage.removeItem('salao_user');
};

export const hasPermission = (role, permission) => {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};
