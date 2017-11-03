import mongoose from 'mongoose'

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const categorySchema = new Schema({
  name:{
    unique: true,
    type: String
  },
  id: Number,
  shops:[{type:ObjectId,ref:'Shop'}],
  goods:[{type:ObjectId,ref:'Goods'}],
  meta:{
    createAt:{
      type:Date,
      default: Date.now()
    },
    updateAt:{
      type:Date,
      default: Date.now()
    }
  }
})

categorySchema.pre('save',function(next){
  if(this.isNew){
    this.meta.createAt = this.meta.updateAt = Date.now()
  } 
  else {
    this.meta.updateAt = Date.now()
  }
  next()
})

categorySchema.statics = {
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

let Category = mongoose.model('Category',categorySchema)
export default Category