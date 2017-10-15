var mongoose = require('mongoose')

var IdsSchema = new mongoose.Schema({
  restaurant_id:Number,
  food_id:Number,
  user_id:Number,
  category_id:Number
})
var Ids = mongoose.model('Ids',IdsSchema)

Ids.findOne(function(err,data){
  if(!data){
    var newIds = new Ids({
      restaurant_id:0,
      food_id:0,
      user_id:0,
      category_id:0
    })
    newIds.save()
  }
})

module.exports = Ids