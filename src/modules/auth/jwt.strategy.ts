import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Buyer } from '../users/buyer/entities/buyer.entity';
import { Admin } from '../users/admin/entities/admin.entity';
import { Seller } from '../users/seller/entities/seller.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configSvc: ConfigService,
    private jwtSvc: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Buyer) private readonly buyerRepository: Repository<Buyer>,
    @InjectRepository(Admin) private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Seller) private readonly sellerRepository: Repository<Seller>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configSvc.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(req: Request) {
    let jwt = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    let user = await this.jwtSvc.decode(jwt);
    if (!user) {
      throw new UnauthorizedException('JwtStrategy unauthorized');
    }
    let userData: any;
    if (user?.type === "buyer") {
      userData = await this.buyerRepository.findOne({
        where: { email: user.email, deleteFlag: false },
      });
    } else if (user?.type === "seller") {
      userData = await this.sellerRepository.findOne({
        where: { email: user.email, deleteFlag: false },
      });
    } else if (user?.type === "admin") {
      userData = await this.adminRepository.findOne({
        where: { email: user.email, deleteFlag: false },
      });
    }

    return userData;
  }
}
