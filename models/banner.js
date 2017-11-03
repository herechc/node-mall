import mongoose from 'mongoose'

const Schema = mongoose.Schema

const bannerSchema = new Schema({
  image_path:String,
  id:Number,
  meta:{
    createAt: {
      type:Date,
      default:Date.now()
    },
    updateAt:{
      type:Date,
      default:Date.now()
    }
  }
})

bannerSchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

bannerSchema.statics = {
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

let Banner = mongoose.model('Banner',bannerSchema)
export default Banner