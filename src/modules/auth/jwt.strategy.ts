import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Buyer } from "../users/buyer/entities/buyer.entity";
import { Admin } from "../users/admin/entities/admin.entity";
import { Seller } from "../users/seller/entities/seller.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configSvc: ConfigService,
    private jwtSvc: JwtService,
    @InjectRepository(Buyer)
    private readonly buyerRepository: Repository<Buyer>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Seller)
    private readonly sellerRepository: Repository<Seller>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configSvc.get<string>("JWT_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    console.log({ payload });
    const jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const decoded: any = this.jwtSvc.decode(jwt);
    const user = payload?.user || payload?.user?.user;
    console.log({ validate_user: user });
    if (!user) {
      throw new NotFoundException("User not found ...!");
    }

    let userData: any;
    if (user?.type === "buyer") {
      userData = await this.buyerRepository.findOne({
        where: { id: user.id, deleteFlag: false },
      });
    } else if (user?.type === "seller") {
      userData = await this.sellerRepository.findOne({
        where: { id: user.id, deleteFlag: false },
      });
    } else {
      userData = await this.adminRepository.findOne({
        where: { id: user.id, deleteFlag: false },
      });
    }

    if (!userData) {
      throw new NotFoundException("User not found ...!");
    }

    return userData;
  }
}
