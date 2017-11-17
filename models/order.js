import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const orderSchema = new Schema({
  user:{
    type:ObjectId,
    ref:'User'
  },
  user_id:Number,
  id:Number,
  entities:[{
    id:Number,//商品id
    name:String,
    price:Number,
    quantity:Number,
  }],
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


orderSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }
  next()
})

orderSchema.statics = {
  fetch:function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById:function(_id,cb){
    return this
      .findOne({id:_id})
      .exec(cb)
  }  
}

const Order = mongoose.model('Order',orderSchema)
export default Order