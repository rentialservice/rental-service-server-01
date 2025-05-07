import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    console.log({ request });
    const token = request.headers.authorization?.split(" ")[1];
    console.log({ token });
    if (!token) throw new UnauthorizedException("Token missing");

    try {
      const payload = this.jwtService.decode(token);
      console.log({ payload });
      request.user = payload.user || payload;
      return true;
    } catch (error) {
      console.log({ error });
      throw new UnauthorizedException("Invalid token");
    }
  }
}
