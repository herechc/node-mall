import Category from '../models/category'
// import _ from 'underscore'
import baseComponent from '../prototype/base'

export  default {
  //新建分类
  new: async (req,res)=>{
    let categorr_id;
    categorr_id = await baseComponent.base.getId('category_id')
    if(!categorr_id){
      console.log('获取分类id失败')
      res.send({
        code: -1,
        message: '获取失败',
        type: 'ERROR_DATA'
      })
      return
    }
    let cateOjb = req.body;
    cateOjb.id = categorr_id;

    let _category = new Category(cateOjb);
    Category.findOne({name: _category.name},(err,category)=>{
      // console.log(category)
      if(err){
        console.log(err)
      }
      if(category){
        res.send({
          code: -1,
          message: '处理失败',
          type: 'ERROR_PARAMS'
        })
      }else{
        console.log(333,_category)
        _category.save(function(err){
          console.log(122)
          if(err){
            console.log(err)
          }
          res.json({
            code: 0,
            message: '处理成功'
          })
        })
      }
    })
  },
  //获取分类列表
  list:(req,res) => {
    console.log(Category.fetch())
    Category.fetch(function(err,category){
      if(err){
        console.log(err)
      }
      res.send({
        code: 0,
        message: '处理成功',
        data: category
      })
    })
  }
}