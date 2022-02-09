import { Response, Request, NextFunction } from 'express';
import passport from 'passport';
import '../../auth/passportHandler';

class AuthMiddleware {
  public authenticateJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user, info) => {
      console.log(info);
      if (err) {
        console.log(err);
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      }
      if (!user) {
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      }
      res.locals.user = user;
      return next();
    })(req, res, next);
  }

  public authorizeJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', (err, user, jwtToken) => {
      if (err) {
        console.log(err);
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      }
      if (!user) {
        return res.status(401).json({ status: 'error', code: 'unauthorized' });
      }
      const scope = req.baseUrl.split('/').slice(-1)[0];
      const authScope = jwtToken.scope;
      if (authScope && authScope.indexOf(scope) > -1) {
        res.locals.user = user;
        return next();
      }
      return res.status(401).json({ status: 'error', code: 'unauthorized' });
    })(req, res, next);
  }
}

export default AuthMiddleware;
