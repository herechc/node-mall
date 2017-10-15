var Shop = require('../models/shop')
var formidable = require('formidable')
var baseComponent = require('../prototype/base')
var Ids = require('../models/ids')
var co = require('co')
exports.new = function (req, res) {
  var form = new formidable.IncomingForm()
  form.parse(req, function(err, fields, files){
    try {
      if (!fields.name) {
        throw new Error('必须填写商店名称')
      } 
      // else if (!fields.full_address) {
      //   throw new Error('必须填写商店地址')
      // } else if (!fields.mobile) {
      //   throw new Error('必须填写联系电话')
      // } else if (!fields.category) {
      //   throw new Error('必须选择食品种类')
      // }
    } catch (err) {
      console.log('前台参数出错:', err.message)
      res.json({
        status: -1,
        type: 'ERROR_PARAMS',
        message: err.message
      })
      return
    }
    var _id,idData;
    co(function(){
      return Promise.resolve(Ids.findOne())
    }).then(function(id){
      var idData = id
      idData["restaurant_id"]++
      idData.save(function(err,data){
        var _id = data["restaurant_id"]
        var newShop = {
          name: fields.name,
          full_address: fields.full_address,
          mobile: fields.mobile,
          slogan: fields.slogan || '',
          category: fields.category,
          id:_id,
          delivery_fee: fields.delivery_fee || '',
          opening_start_time: fields.opening_start_time || '',
          opening_end_time: fields.end_time || '',
          shop_portrait: fields.shop_portrait || ''
        }
        try {
          var shop = new Shop(newShop)
          Shop.findOne({name:fields.name},function(err,_shop){
            if(!_shop){
              shop.save()
              res.json({
                status: 0,
                success: '添加成功',
                data: newShop
              })
            }else {
              res.json({
                status: -1,
                message: '商品已经存在',
                type: 'ERROR_PARAMS'
              })
            }
          })
        } catch (err) {
          res.json({
            status: -1,
            type: 'ERROR_SERVER',
            message: '添加失败'
          })
        }
      })
    })
  })
}

exports.list = function(req,res){
  Shop.find({},function(err,shop){
    
  })
}