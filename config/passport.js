const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;
const model = require('../models/accountModel')


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';

module.exports = passport => {
  passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    const results = await model.getUserByPhone(jwt_payload.phone);
    if (results.length > 0) {
      return done(null, results[0]);
    }
    return done(null, false);
  }));
}