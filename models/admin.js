var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var SALT_WORK_FACTOR = 10

var AdminSchema  = new mongoose.Schema({
  name:{
    unique: true,
    type: String
  },
  password: String,
  token:String,
  id: Number,
  role: Number,
  meta:{
    createAt:{
      type: Date,
      default: Date.now()
    },
    updateAt:{
      type: Date,
      default: Date.now()
    }
  }
})
///每次存储数据之前都调用这个方法 pre save
AdminSchema.pre('save',function(next){
  var admin = this
  //帐号是否是新的，是否修改密码
  if(this.isModified('password') || this.isNew){
    admin.meta.createAt = admin.meta.update = Date.now()
	//先生成随机盐，再将密码和盐混合加密，最终拿到存储密码。第一个参数为计算强度，即计算密码所需的资源和时间，回调方法拿到生成后的盐
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
      if(err){
        return next(err)
      }
      //hash
      bcrypt.hash(admin.password, salt, function(err, hash){
        if(err){
          return next(err);
        }
        //密码加密
        admin.password = hash;
        next();
      });
    })
  } else{
    // 更新时间
    admin.meta.updateAt = Date.now()
    return next()
  }
})
//通过实例可调用的方法，若为静态方法statics则用模型便可(对应app.js的signin)
AdminSchema.methods = {
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

//增加一个静态方法，该静态方法不会与数据库直接交互，只有经过model(模型)编译并实例化后才会具有这个方法
AdminSchema.statics = {
  //取出目前数据库里所有的数据
  fetch:function(limit,offset,cb){
    return this
      .find({})
      .sort({admin_id: -1})
      .limit(Number(limit))
      .skip(Number(offset))
      .exec(cb)
  },
  //用来查询单条数据
  findById:function(id,cb){
    return this
      .findOne({_id:id})
      .exec(cb)
  }  
}


var Admin = mongoose.model('Admin',AdminSchema)
module.exports = Admin