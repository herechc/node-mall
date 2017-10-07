var Shop = require('../models/shop')
var formidable = require('formidable')

exports.new = function (req, res) {
  var form = new formidable.IncomingForm()
  form.parse(req, function(err, fields, files){
    try {
      if (!fields.name) {
        throw new Error('必须填写商店名称')
      } else if (!fields.full_address) {
        throw new Error('必须填写商店地址')
      } else if (!fields.mobile) {
        throw new Error('必须填写联系电话')
      } else if (!fields.category) {
        throw new Error('必须选择食品种类')
      }
    } catch (err) {
      console.log('前台参数出错:', err.message)
      res.json({
        status: 0,
        type: 'ERROR_PARAMS',
        message: err.message
      })
      return
    }
    var newShop = {
      name: fields.name,
      full_address: fields.full_address,
      mobile: fields.mobile,
      slogan: fields.slogan || '',
      category: fields.category,
      delivery_fee: fields.delivery_fee || '',
      opening_start_time: fields.opening_start_time || '',
      opening_end_time: fields.end_time || '',
      shop_portrait: fields.shop_portrait || ''
    }
    try {
      var shop = new Shop(newShop)
      shop.save()
      res.json({
        status: 1,
        success: '添加餐馆成功',
        data: newShop
      })
    } catch (err) {
      res.json({
        status: 0,
        type: 'ERROR_SERVER',
        message: '添加商铺失败'
      })
    }
  })
}
exports.list = function(req,res){
  Shop.find({},function(err,shop){
    
  })
}