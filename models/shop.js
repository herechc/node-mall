var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
var ShopSchema = new Schema({
  name:{
    unique:true,
    type: String
  },
  full_address: String,
  mobile:Number,
  id:Number,
  detail: String,
  slogan:String,
  category:{
    type: ObjectId,
    ref: 'Category'
  },
  delivery_fee: Number,
  opening_start_time: Date,
  opening_end_time: Date,
  pv:{
    type:Number,
    default: 0
  },
  shop_portrait:String,
  meta:{
    createAt:{
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  }
})

ShopSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

ShopSchema.static = {
  fetch:function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById:function(id,cb){
    return this
      .findOne({_id:id})
      .exec(cb)
  }
}
var Shop = mongoose.model('Shop',ShopSchema)
module.exports = Shop