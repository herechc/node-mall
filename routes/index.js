var User = require('../controllers/user')
var Shop = require('../controllers/shop')
import Category from '../controllers/category'

module.exports = function(app){
  /*--admin--*/
    /*user*/
    app.post('/admin/user/signup',User.signup)
    app.post('/admin/user/signin',User.signin)
    
    /*shop*/
    app.post('/admin/shop/new',Shop.new)
    app.get('/admin/shop/list',Shop.list)

    /*category*/
    app.post('/admin/category/new',Category.new)
    app.get('/admin/category/list',Category.list)

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404;
    next(err);
  })

}
