import passport from 'passport';
import passportLocal from 'passport-local';
// import passportApiKey from "passport-headerapikey";
import passportJwt from 'passport-jwt';
import { PrismaClient } from '@prisma/client';
// import { User } from '../models/user';
import bcrypt from 'bcrypt';
import config from '../configs/config';

const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const { ExtractJwt } = passportJwt;

const prisma = new PrismaClient();

const isCorrectPassword = (password: string, existing: string) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  if (hashedPassword === existing) {
    return true;
  }
  return false;
};

passport.use(new LocalStrategy({ usernameField: 'mobile' }, async (mobile: any, password: any, done: any) => {
  const usernameString = mobile;
  prisma.user.findUnique({
    where: { mobile: usernameString },
  }).then((user) => {
    console.log(user);
    if (!user) {
      return done(undefined, false, { message: `mobile ${mobile} not found.` });
    }
    // if (isCorrectPassword(password, user.password)) {
    //   return done(undefined, user);
    // }
    return done(undefined, false, { message: 'invalid mobile' });
  }).catch((error) => {
    console.log(error);
    return done(undefined, false);
  });
  return done(undefined, false, { message: 'invalid mobile' });

  /* User.findOne({ username: username.toLowerCase() }, (err: any, user: any) => {
    if (err) { return done(err); }
    if (!user) {
      return done(undefined, false, { message: `username ${username} not found.` });
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: 'Invalid username or password.' });
    });
  }); */
}));

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
  }, (async (jwtToken, done) => {
    prisma.user.findUnique({
      where: { mobile: jwtToken.mobile },
    }).then((user) => {
      if (user) {
        return done(undefined, user, jwtToken);
      }
      return done(undefined, false);
    }).catch((error) => {
      console.log(error);
      return done(undefined, false);
    });
  }),
));
