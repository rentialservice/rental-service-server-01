import { Blacklist } from "../../modules/auth/entities/blacklist.entity";
import { Buyer } from "../../modules/users/buyer/entities/buyer.entity";
import { DynamicData } from "../../modules/dynamic/entities/dynamic-data.entity";
import { DynamicSchema } from "../../modules/dynamic/entities/dynamic-schema.entity";
import { Firm } from "../../modules/firm/entities/firm.entity";
import { NotificationToken } from "../../modules/supporting-modules/notification/entities/notification-token.entity";
import { Notification } from "../../modules/supporting-modules/notification/entities/notification.entity";
import { Seller } from "../../modules/users/seller/entities/seller.entity";
import { Admin } from "../../modules/users/admin/entities/admin.entity";
import { Category } from "../../modules/category/entities/category.entity";
import { CustomFields } from "src/modules/custom-fields/entities/custom-fields.entity";
import { Role } from "../../modules/role/entities/role.entity";
import { Permission } from "../../modules/permission/entities/permission.entity";
import { Module_Table } from "../../modules/module/entities/module.entity";
import { Product } from "../../modules/product/entities/product.entity";
import { CustomFieldsData } from "../../modules/custom-fields/entities/custom-fields-data.entity";
import { Subscription } from "../../modules/subscription/entities/subscription.entity";
import { Rental } from "../../modules/rental/entities/rental.entity";
import { PaymentCollection } from "../../modules/payment-collection/entities/payment-collection.entity";
import { PaymentMode } from "../../modules/payment-mode/entities/payment-mode.entity";
import { Prefix } from "../../modules/prefix/entities/prefix.entity";

export const entities = [
    Admin,
    Buyer,
    Seller,
    Blacklist,
    Notification,
    NotificationToken,
    Firm,
    DynamicData,
    DynamicSchema,
    Category,
    CustomFields,
    CustomFieldsData,
    Role,
    Permission,
    Module_Table,
    Product,
    Subscription,
    Rental,
    PaymentCollection,
    PaymentMode,
    Prefix
];