import Shop from'../models/shop'
import formidable from 'formidable'
import baseComponent from '../prototype/base'
import Ids from '../models/ids'
import Category from '../models/category'
//添加餐馆
exports.new = async function (req, res) {
  let restaurant_id;
  let cate;
  try{
    restaurant_id = await baseComponent.base.getId('restaurant_id')
  }catch(err){
    console.log('获取商店id失败')
    res.send({
      type:'ERROR_DATA',
      message: '获取数据失败'
    })
    return
  }
  var form = new formidable.IncomingForm()
  form.parse(req, async function(err, fields, files){
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
        code: -1,
        type: 'ERROR_PARAMS',
        message: err.message
      })
      return
    }
    cate = await Category.findById(fields.category)
    var newShop = {
      name: fields.name,
      full_address: fields.full_address,
      mobile: fields.mobile,
      slogan: fields.slogan || '',
      category: fields.category,
      id:restaurant_id,
      delivery_fee: fields.delivery_fee || '',
      opening_start_time: fields.opening_start_time || '',
      opening_end_time: fields.end_time || '',
      shop_portrait: fields.shop_portrait || ''
    }
    try {
      var shop = new Shop(newShop)
      shop.category = cate._id
      Shop.findOne({name:fields.name},function(err,_shop){
        if(!_shop){
          try{
            shop.save((err,shop)=>{
              if(err){
                console.log(err)
              }
              cate.shops.push(shop._id)
              cate.save()
              res.json({
                code: 0,
                message: '添加成功'
              })
            }) 
          }catch(err){
            res.send({
              code:-1,
              message:err
            })
          }
        }else {
          res.json({
            code: -1,
            message: '商品已经存在',
            type: 'ERROR_PARAMS'
          })
        }
      })
    } catch (err) {
      res.json({
        code: -1,
        type: 'ERROR_SERVER',
        message: '添加失败'
      })
    }    
  })
}
//获取餐馆列表
exports.list = function(req,res){
  const _id  = req.query.id
  if(_id){
    Shop.findById(_id,function(err,shop){
      if(err){
        console.log(err)
      }
      if(shop){
        res.send({
          code: 0,
          data:shop,
          message: '处理成功'
        })
      }else {
        res.send({
          code:-1,
          message:'处理失败'
        })
      }
    })
  }else {
    Shop.fetch(function(err,shop){
      if(err){
        console.log(err)
      }
      if(shop){
        res.send({
          code: 0,
          data:shop,
          message: '处理成功'
        })
      }else {
        res.send({
          code:-1,
          message:'处理失败'
        })
      }
    })
  }
}