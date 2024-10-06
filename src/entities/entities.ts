import { Blacklist } from "../modules/auth/entities/blacklist.entity";
import { Buyer } from "../modules/users/buyer/entities/buyer.entity";
import { DynamicData } from "../modules/dynamic/entities/dynamic-data.entity";
import { DynamicSchema } from "../modules/dynamic/entities/dynamic-schema.entity";
import { Firm } from "../modules/firm/entities/firm.entity";
import { NotificationToken } from "../modules/supporting-modules/notification/entities/notification-token.entity";
import { Notification } from "../modules/supporting-modules/notification/entities/notification.entity";
import { Seller } from "../modules/users/seller/entities/seller.entity";
import { User } from "../modules/user/entities/user.entity";
import { Admin } from "../modules/users/admin/entities/admin.entity";
import { Category } from "../modules/category/entities/category.entity";

export let Entities = [
    Admin,
    Buyer,
    Seller,
    User,
    Blacklist,
    Notification,
    NotificationToken,
    Firm,
    DynamicData,
    DynamicSchema,
    Category
] 