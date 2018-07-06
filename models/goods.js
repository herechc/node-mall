import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const GoodsSchema = new Schema({
  name:{
    type:String,
    unique:true
  },
  price:Number,
  pv:{
    type:Number,
    default:0
  },
  image_path:String,
  category:{
    type:ObjectId,
    ref:'Categofy'
  },
  category_id:Number,
  category_name:String,
  id: Number,
  meta:{
    createAt:{
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  },
  descr: String,
  sold:Number,
  stock:Number,
  picture:Array
},{
  usePushEach: true
  })

//每次保存执行的方法
GoodsSchema.pre('save',function(next){
  //这里别使用箭头函数，因为会改变this指向
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

//model静态方法
GoodsSchema.statics = {
  fetch: function(cb){
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(_id,cb){
    return this
      .findOne({id:_id})
      .exec(cb)
  }  
}

const Goods = mongoose.model('Goods',GoodsSchema)
export default Goods
