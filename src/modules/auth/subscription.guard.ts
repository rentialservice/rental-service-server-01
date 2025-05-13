import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SubscriptionService } from "../subscription/subscription.service";

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionService: SubscriptionService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    
    // Allow all GET requests without subscription check
    if (method === "GET") {
        return true;
    }

    // Check if the route is marked with @AllowWithoutSubscription
    const allowWithoutSubscription = this.reflector.get<boolean>(
        "allowWithoutSubscription",
        context.getHandler()
    );
    if (allowWithoutSubscription) {
        return true;
    }

    // For other requests, check subscription
    const user = request.user;
    console.log({ hasSubscription_user: user });
    
    // Get firm ID from user data based on user type
    let firmId: string;
    if (user.type === 'seller') {
        firmId = user.firm?.id;
    } else if (user.type === 'buyer') {
        firmId = user.buyerProfile?.firmId;
    }

    if (!firmId) {
        throw new ForbiddenException("No valid firm association found");
    }

    const hasSubscription = await this.subscriptionService.hasActiveSubscription(firmId);

    if (!hasSubscription) {
        throw new ForbiddenException("No active subscription");
    }

    return true;
}
}
