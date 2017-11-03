var User = require('../controllers/user')
var Shop = require('../controllers/shop')
import Category from '../controllers/category'
import Banner from '../controllers/banner'
import Goods from  '../controllers/goods'
import validate from '../utils/validate'
import common from '../prototype/common'

const _common = new common()

module.exports = function(app){
  // catch 404 and forward to error handler
    //要放在前面
    // app.use(function(req, res, next) {
    //   var err = new Error('Not Found')
    //   err.status = 404;
    //   next(err);
    // })

  //user
  app.post('/admin/signup',User.signup)
  app.post('/admin/login',User.login)
  
  //shop
  app.post('/admin/shop/new',validate.token,Shop.new)
  app.get('/admin/shop/list',validate.token,Shop.list)

  //category
  app.post('/admin/category/new',validate.token,Category.new)
  app.get('/admin/category/list',validate.token,Category.list)
  app.post('/admin/category/del/:id',validate.token,Category.del)
    
  //img
  app.post('/addimg/:type',_common.uploadImg)
  //banner
  app.post('/admin/banner/new',validate.token,Banner.new )    
  app.get('/admin/banner/list',validate.token,Banner.list )    
  app.post('/admin/banner/del/:id',validate.token,Banner.del )    
  //goods
  app.post('/admin/goods/new',validate.token,Goods.addGoods)
  app.get('/admin/goods/list',validate.token,Goods.list)
  app.post('/admin/goods/del/:id',validate.token,Goods.del)
}
