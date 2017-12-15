import Category from '../models/category'
// import _ from 'underscore'
import common from '../prototype/common'

const _common = new common()
export  default {
  //新建分类
  new: async (req,res)=>{
    let category_id;
    category_id = await _common.getId('category_id')
    console.log(category_id)
    if(!category_id){
      console.log('获取分类id失败')
      res.send({
        code: 0,
        message: '获取失败',
        type: 'ERROR_DATA'
      })
      return
    }
    let cateOjb = req.body;
    cateOjb.id = category_id;

    let _category = new Category(cateOjb);
    Category.findOne({name: _category.name},(err,category)=>{
      // console.log(category)
      if(err){
        console.log(err)
      }
      if(category){
        res.send({
          code: 0,
          message: '分类已存在',
          type: 'ERROR_PARAMS'
        })
      }else{
        _category.save(function(err){
          if(err){
            console.log(err)
          }
          res.json({
            code: 1,
            message: '处理成功'
          })
        })
      }
    })
  },
  //获取分类列表
  list:(req,res) => {
    Category.fetch(function(err,category){
      if(err) console.log(err);
      const cate = category.reverse()
      res.send({
        code: 1,
        message: '处理成功',
        list: cate
      })
    })
  },
  goods: (req,res) => {
    const cate_id = req.params.id
    if(!cate_id || !parseInt(cate_id)){
      console.log("cate_id参数错误")
      res.send({
        code:0,
        message: 'category_id参数错误',
        type: "ERROR_PARAMS"
      })
      return
    }
    Category
      .find({id:cate_id})
      .populate('goods')
      .exec(function(err,category){
        res.send({
          code:1,
          message:'处理成功',
          list:category[0].goods
        })
      })
  },
  //删除分类
  del: async (req,res)=>{
    const cate_id = req.params.id
    if(!cate_id || !parseInt(cate_id)){
      console.log("cate_id参数错误")
      res.send({
        code:0,
        message: 'category_id参数错误',
        type: "ERROR_PARAMS"
      })
      return
    }
    try{
      await Category.remove({id:cate_id})
      res.send({
        code:1,
        message:'处理成功'
      })
    }catch(err){
      console.log('删除cate_id失败')
      res.send({
        code:0,
        message:'删除分类失败'
      })
    }
  }
}