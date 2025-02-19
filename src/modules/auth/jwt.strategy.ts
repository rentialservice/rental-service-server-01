import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Buyer } from '../users/buyer/entities/buyer.entity';
import { Admin } from '../users/admin/entities/admin.entity';
import { Seller } from '../users/seller/entities/seller.entity';

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
    private readonly sellerRepository: Repository<Seller>,
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
    user = user?.user || user?.user?.user;
    if (!user) {
      throw new UnauthorizedException('JwtStrategy unauthorized');
    }
    let userData: any;
    if (user?.type === 'buyer') {
      userData = await this.buyerRepository.findOne({
        where: { id: user.id, deleteFlag: false },
      });
    } else if (user?.type === 'seller') {
      userData = await this.sellerRepository.findOne({
        where: { id: user.id, deleteFlag: false },
      });
    } else {
      userData = await this.adminRepository.findOne({
        where: { id: user.id, deleteFlag: false },
      });
    }
    if (!userData) {
      throw new UnauthorizedException('Unauthorized user ...!');
    }

    return userData;
  }
}
