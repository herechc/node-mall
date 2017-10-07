var User = require('../controllers/user')
var Shop = require('../controllers/shop')
module.exports = function(app){
  /*--admin--*/
  /*user*/
  app.post('/admin/user/signup',User.signup)
  app.post('/admin/user/signin',User.signin)
  
  /*shop*/
  app.post('/admin/shop/new',Shop.new)
  app.get('admin/shop/list',Shop.list)

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found')
    err.status = 404;
    next(err);
  })

}
