import { SetMetadata } from "@nestjs/common";

export const AllowWithoutSubscription = () =>
  SetMetadata("allowWithoutSubscription", true);
