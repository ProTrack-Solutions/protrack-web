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
}

export interface UpdateUserParams {
  department_id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  username: string;
}
