
import passport from 'passport'
export default {
  //验证token
  adminToken: passport.authenticate('admin', { session:false}),
  userToken: passport.authenticate('user', { session:false})
}