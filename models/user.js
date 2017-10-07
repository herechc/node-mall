var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var SALT_WORK_FACTOR = 10

var UserSchema  = new mongoose.Schema({
  name:{
    unique: true,
    type: String
  },
  password: String,
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

UserSchema.pre('save',function(next){
  var user = this
  if(this.isNew){
    user.meta.createAt = user.meta.update = Date.now()
  } else{
    user.meta.updateAt = Date.now()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    if(err){
      return next(err)
    }
    bcrypt.hash(user.password, salt, function(err, hash){
			if(err){
				return next(err);
			}
			
			user.password = hash;
			next();
		});
  })
})

UserSchema.methods = {
  comparePassword: function(_password, cb){
    bcrypt.compare(_password,this.password,function(err,isWatch){
      if(err){
        return cb(err)
      }
      cb(null,isWatch)
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
  findById:function(id,cb){
    return this
      .findOne({_id:id})
      .exec(cb)
  }  
}

var User = mongoose.model('User',UserSchema)
module.exports = User