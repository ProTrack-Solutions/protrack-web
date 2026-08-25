export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  status: string;
  company_id: string;
  department_id: string;
  last_login_at: Date;
  created_by: string;
  updated_by: string;
  deleted_by: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  department_name: string;
  // Códigos dos módulos liberados para o departamento do usuário (mesma fonte
  // usada pelo RequireModule no backend). ADMIN sempre tem acesso a tudo,
  // independente do que vier aqui — trate role === "ADMIN" como bypass.
  modules: string[];
}

export interface UpdateUserParams {
  department_id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  username: string;
}

export interface UpdatePasswordParams {
  current_password: string;
  password: string;
}
