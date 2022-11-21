import {IDatabaseUser} from "@interfaces/user";
import {User} from "@db/entities/User";

export const mapUserResponse = (user: User): IDatabaseUser => {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    family_name: user.family_name,
    given_name: user.given_name,
    phone_number: user.phone_number,
    company: user.company,
    notes: user.notes,
    active: user.active,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}