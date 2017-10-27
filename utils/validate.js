
import passport from 'passport'
export default {
  //验证token
  token: passport.authenticate('bearer', { session:false})
}