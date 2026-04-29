import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';

type RequestWithHeaders = {
  headers: Record<string, string | string[] | undefined>;
  admin?: unknown;
};

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly auth: AdminAuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithHeaders>();
    const authorizationHeader = request.headers.authorization;
    const authorization = Array.isArray(authorizationHeader)
      ? authorizationHeader[0]
      : authorizationHeader;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Admin bearer token is required.');
    }

    request.admin = this.auth.verifyToken(authorization.slice('Bearer '.length));
    return true;
  }
}
