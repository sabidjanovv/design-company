import { AdminRole } from '../enums/enum';

export interface JwtPayload {
  role: AdminRole;
  id: number;
  is_active: boolean;
  first_name: string;
  last_name: string;
  username: string;
}
