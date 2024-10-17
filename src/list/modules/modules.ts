import { AuthModule } from "../../modules/auth/auth.module";
import { CategoryModule } from "../../modules/category/category.module";
import { CustomFieldsModule } from "../../modules/custom-fields/custom-fields.module";
import { DynamicModule } from "../../modules/dynamic/dynamic.module";
import { FirmModule } from "../../modules/firm/firm.module";
import { ModuleModule } from "../../modules/module/module.module";
import { ProductModule } from "../../modules/product/product.module";
import { MailModule } from "../../modules/supporting-modules/mail/mail.module";
import { NotificationModule } from "../../modules/supporting-modules/notification/notification.module";
import { S3Module } from "../../modules/supporting-modules/s3/s3.module";
import { UserModule } from "../../modules/user/user.module";
import { AdminModule } from "../../modules/users/admin/admin.module";
import { BuyerModule } from "../../modules/users/buyer/buyer.module";
import { SellerModule } from "../../modules/users/seller/seller.module";

export const modules = [
    AdminModule,
    BuyerModule,
    SellerModule,
    S3Module,
    UserModule,
    AuthModule,
    MailModule,
    NotificationModule,
    FirmModule,
    DynamicModule,
    CategoryModule,
    CustomFieldsModule,
    ModuleModule,
    ProductModule,
]