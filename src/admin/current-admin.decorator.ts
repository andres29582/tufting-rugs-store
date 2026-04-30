import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AdminJwtPayload } from './admin-auth.types';

type RequestWithAdmin = {
  admin?: AdminJwtPayload;
};

export const CurrentAdmin = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AdminJwtPayload => {
    const request = context.switchToHttp().getRequest<RequestWithAdmin>();
    return request.admin as AdminJwtPayload;
  }
);
