import { Role } from "common";

export interface JwtPayload {
    id: string;
    email: string;
    role: Role;
}