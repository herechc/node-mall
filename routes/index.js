var User = require('../controllers/user')
var Shop = require('../controllers/shop')
import Category from '../controllers/category'
import validate from '../utils/validate'

module.exports = function(app){
  // catch 404 and forward to error handler
    //要放在前面
    // app.use(function(req, res, next) {
    //   var err = new Error('Not Found')
    //   err.status = 404;
    //   next(err);
    // })


  /*--admin--*/
    /*user*/
    app.post('/admin/signup',User.signup)
    app.post('/admin/login',User.login)
    
    /*shop*/
    app.post('/admin/shop/new',validate.token,Shop.new)
    app.get('/admin/shop/list',validate.token,Shop.list)

    /*category*/
    app.post('/admin/category/new',validate.token,Category.new)
    app.get('/admin/category/list',validate.token,Category.list)



}
