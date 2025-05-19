import { SetMetadata } from '@nestjs/common';
import { Role } from 'common';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
