import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const SALT_WORK_FACTOR = 10
const UserSchema = new Schema({
  username:{
    type:String,
    unique:true
    // require: true // 不可为空约束
  },
  id:Number,
  //username跟name同时设置unique，那么我每次注册的时候name都提交空值，所以会返回错误
  password:String,
  token:String,
  userInfo:{
    type:ObjectId,
    ref:'UserInfo'
  },
  order:[{
    type:ObjectId,
    ref:'Order'
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
  },
})


//每次保存执行的方法
UserSchema.pre('save',function(next){
  var user = this
  //这里别使用箭头函数，因为会改变this指向
  if(this.isModified('password') || this.isNew && user.password){
    user.meta.createAt = user.meta.updateAt = Date.now()

    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
      if(err) return next(err);
      bcrypt.hash(user.password, salt, function(err,hash){
        // console.log(233,hash)
        if(err) return next(err);
        user.password = hash
        next()
      })
    })
  } else {
    this.meta.updateAt = Date.now()
    return next()
  }
  
})

UserSchema.methods = {
  // 验证密码
  comparePassword: function(_password, cb){//该方法接收提交过来的参数和回调
    bcrypt.compare(_password,this.password,function(err,isWatch){//bcrypt密码校对方法,与当前数据库密码比对
      if(err){
        return cb(err) //若有错则包装到回调
      }
      cb(null,isWatch)//若没错err为null，并把密码是否是匹配的值返回
    })
  }
}


UserSchema.statics = {
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

const User = mongoose.model('User',UserSchema)
export default User