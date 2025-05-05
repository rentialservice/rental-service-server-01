import { AuthModule } from "../../modules/auth/auth.module";
// import { CategoryModule } from '../../modules/category/category.module';
import { CommonModule } from "../../modules/common/common.module";
import { CustomFieldsModule } from "../../modules/custom-fields/custom-fields.module";
import { DynamicModule } from "../../modules/dynamic/dynamic.module";
import { FirmModule } from "../../modules/firm/firm.module";
import { PaymentCollectionModule } from "../../modules/payment-collection/payment-collection.module";
import { PaymentModeModule } from "../../modules/payment-mode/payment-mode.module";
import { PaymentModule } from "../../modules/payment/payment.module";
import { PermissionModule } from "../../modules/permission/permission.module";
import { PrefixModule } from "../../modules/prefix/prefix.module";
import { ProductModule } from "../../modules/product/product.module";
import { RentalProductModule } from "../../modules/rental-products/rental-product.module";
import { RentalModule } from "../../modules/rental/rental.module";
import { RoleModule } from "../../modules/role/role.module";
import { SubscriptionModule } from "../../modules/subscription/subscription.module";
import { MailModule } from "../../modules/supporting-modules/mail/mail.module";
import { NotificationModule } from "../../modules/supporting-modules/notification/notification.module";
import { S3Module } from "../../modules/supporting-modules/s3/s3.module";
import { TermsAndConditionsModule } from "../../modules/terms-and-conditions/terms-and-conditions.module";
import { AdminModule } from "../../modules/users/admin/admin.module";
import { BuyerModule } from "../../modules/users/buyer/buyer.module";
import { SellerModule } from "../../modules/users/seller/seller.module";

export const modules = [
  AdminModule,
  BuyerModule,
  SellerModule,
  S3Module,
  AuthModule,
  MailModule,
  NotificationModule,
  FirmModule,
  DynamicModule,
  // CategoryModule,
  CustomFieldsModule,
  ProductModule,
  PermissionModule,
  RoleModule,
  SubscriptionModule,
  RentalModule,
  PaymentCollectionModule,
  PaymentModeModule,
  PrefixModule,
  CommonModule,
  TermsAndConditionsModule,
  RentalProductModule,
  PaymentModule,
];
