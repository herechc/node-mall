import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const UserInfoSchema = new Schema({
  name:String,
  avatar:{
    type:String,
    default:'default.jpg'
  },
  mobile:Number,
  full_address:String,
  id:Number,
  remark:String,
  user:{
    type:ObjectId,
    ref:'User'
  },
  // order:{
  //   ref:ObjectId,
  //   ref:'Order'
  // },
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


UserInfoSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }
  next()
})

UserInfoSchema.statics = {
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

const UserInfo = mongoose.model('UserInfo',UserInfoSchema)
export default UserInfo