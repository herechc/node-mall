var Admin = require('../controllers/admin')
var Shop = require('../controllers/shop')
import User from '../controllers/user'
import Category from '../controllers/category'
import Banner from '../controllers/banner'
import Goods from  '../controllers/goods'
import validate from '../utils/validate'
import common from '../prototype/common'
import UserInfo from '../controllers/userInfo'
import Order from '../controllers/order'
const _common = new common()

module.exports = function(app){
  // catch 404 and forward to error handler
    //要放在前面
    // app.use(function(req, res, next) {
    //   var err = new Error('Not Found')
    //   err.status = 404;
    //   next(err);
    // })

  /**admin**/
  //admin
  app.post('/v1/admin/signup',Admin.signup)
  app.post('/v1/admin/login',Admin.login)


  //shop
  app.post('/v1/shop/new',validate.adminToken,Shop.new)
  app.get('/v1/shop/list',validate.adminToken,Shop.list)

  //category
  app.post('/v1/category/new',validate.adminToken,Category.new)
  app.get('/v1/category/list',validate.adminToken,Category.list)
  app.post('/v1/category/del/:id',validate.adminToken,Category.del)
    
  //img
  app.post('/addimg/:type',_common.uploadImg)
  //banner
  app.post('/v1/banner/new',validate.adminToken,Banner.new )    
  app.get('/v1/banner/list',validate.adminToken,Banner.list )    
  app.post('/v1/banner/del/:id',validate.adminToken,Banner.del )    
  //goods
  app.post('/v1/goods/new',validate.adminToken,Goods.addGoods)
  app.get('/v1/goods/list',validate.adminToken,Goods.list)
  app.post('/v1/goods/del/:id',validate.adminToken,Goods.del)

  /**user**/
  //user
  app.post('/v1/signup',User.signup)
  app.post('/v1/login',User.login)
  //userInfo
  app.post('/v1/user/info/:id',UserInfo.update)
  app.get('/v1/user/info/:id',UserInfo.list)
  //order
  app.post('/v1/order/:id',Order.addOrder)
  //goods
  app.get('/v1/user/goods',validate.userToken,Goods.list)
  app.get('/v1/user/goods/:id',validate.userToken,Goods.details)
  //category
  app.get('/v1/category',validate.userToken,Category.list)
  app.get('/v1/category/goods/:id',validate.userToken,Category.goods)
  //banner
  app.get('/v1/banner',validate.userToken,Banner.list )
}
