import Goods from '../models/goods'
import common from '../prototype/common'
import Category from '../models/category'

class _Goods extends common{
  constructor(){
    // super用在构造函数中，必须在使用this之前调用
    //调用会生成一个空对象，作为context来调用父类的constructor，返回this对象，
    //作为子类constructor的context继续调用构造函数。
    super()
    this.addGoods = this.addGoods.bind(this)
  }
  async addGoods(req,res,next){
    let data = req.body;
    let goods_id,cate;
    // 获取goods_id
    try{
      goods_id = await this.getId('goods_id')
    }catch(err){
      console.log('获取商品id失败')
      res.send({
        code:0,
        message: '获取goods_id失败'
      })
      return
    }
    // 验证参数
    try{
     if(!data.name){
       throw new Error('必须填写商品名称')
     }else if(!data.price){
       throw new Error('必须填写商品价格')
     }else if(!data.descr){
       throw new Error('必须填写商品描述')
     }else if(!data.category){
       throw new Error('必须选择分类')
     }else if(!data.image_path){
       throw new Error('必须选择图片')
     }
    }catch(err){
      console.log('前台参数错误',err)
      res.send({
        code:0,
        type:'ERROR_PARAMS',
        message:err.message
      })
      return
    }
    //根据id获取所属分类
    cate = await Category.findById(data.category)
    let newGoods = {
      name:data.name,
      price:data.price || undefined,
      descr:data.descr,
      id:goods_id,
      image_path:data.image_path || '',
      category:data.category,
      category_id:cate.id,
      category_name:cate.name || '',
      picture:data.picture || undefined,
      stock:data.stock || 0,
      sold:data.sold || 0
    }
    try {
      const goods = new Goods(newGoods)
      goods.category = cate._id
      //找到goods
      Goods.findOne({name:data.name},async function(err,_goods){
        if(err) console.log(err);
        if(!_goods){
          //保存
          await goods.save(err=>{console.log(err)})
          //保存分类的goods
          cate.goods.push(goods._id)
          await cate.save()
          res.send({
            code:1,
            message:'处理成功'
          })
        }else{
          res.send({
            code:0,
            message:'商品已经存在',
            type:'ERROR_PARAMS'
          })   
        }
      })
    }catch(err){
      console.log(err)
      res.send({
        code:0,
        type: 'ERROR_SERVER',
        message:'添加失败'
      })
    }
  }
  async list(req,res,next){
    if(req.query.id){
      const idlist = req.query.id
      let goodslist = [];
      Object.keys(idlist).forEach(key => {
        Goods.findById(idlist[key],function(err,_goods){
          goodslist.push(_goods)
          if(goodslist.length == idlist.length){
            res.send({
              code:1,
              message: '处理成功',
              list:goodslist
            })
          }
        })
      })
    } else {
      try{
        let { pageSize = 8 } = req.query
        let admins = []
        const data = await Goods.find({}).sort({id: -1}).limit(Number(pageSize))
        let total = await Goods.count()
        Object.keys(data).forEach(key => {
          admins[key] = data[key]
        })
        res.send({
          code:1,
          message:'处理成功',
          list:admins,
          total: total
        })
      }catch(e){
        console.log(e)
      }
    }
  }
  details(req,res){
    const goods_id = req.params.id;
    if(!goods_id){
      res.send({
        type:'ERROR_PARAMS',
        message: '商品id不能为空',
        code: 0
      })
    }
    // console.log(33,req.params.id)
    Goods.findById(goods_id,function(err,goods){
      if(err) console.log(err)
      if(!goods){
        res.send({
          message:'商品不存在',
          code:0
        })
        return
      } else {
        res.send({
          message: '处理成功',
          code:1,
          list: goods
        })
      }
    })
  }
  async del(req,res,next){
    const goods_id = req.params.id;
    if(!goods_id || !parseInt(goods_id)){
      console.log("goods_id参数错误")
      res.send({
        code:0,
        message: 'goods_id参数错误',
        type: "ERROR_PARAMS"
      })
      return
    }
    try{
      await Goods.remove({id:goods_id})
      res.send({
        code:0,
        message:'处理成功'
      })
    }catch(err){
      console.log('删除goods_id失败')
      res.send({
        code:0,
        message:'删除商品失败'
      })
    }
  }
}

export default new _Goods()