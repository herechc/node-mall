import Banner from '../models/banner'
import common from '../prototype/common'

const _common = new common()
export default {
  new: async (req,res) => {
    let banner_id;
    banner_id = await _common.getId('banner_id')
    if(!banner_id){
      console.log('获取焦点图id失败')
      res.send({
        code:0,
        message: '获取失败',
        type: 'ERROR_DATA'
      })
      return
    }
    let bannerObj = req.body
    bannerObj.id = banner_id
    let _banner = new Banner(bannerObj)
    Banner.findOne({id: _banner.id}, (err,banner)=>{
      if(err) console.log(err);
      if (banner) {
        res.send({
          code:0,
          message: '不能重复添加',
          type: 'ERROR_PARAMS'
        })
      } else {
        _banner.save(err=>{
          if(err) console.log(err);
          res.json({
            code:1,
            message:'处理成功'
          })
        })
      }
    })
  },
  list: (req,res) => {
    Banner.fetch((err,banner)=>{
      if(err) console.log(err);
      res.send({
        code:1,
        message: '处理成功',
        list:banner
      })
    })
  },
  del: async (req,res) => {
    const ban_id = req.params.id
    if(!ban_id || !parseInt(ban_id)){
      console.log('banner_id参数错误')
      res.send({
        code:0,
        message: 'banner_id参数错误',
        type: 'ERROR_PARAMS'
      })
      return
    }
    try{
      await Banner.remove({id:ban_id})
      res.send({
        code:1,
        message: '处理成功'
      })
    }catch(err){
      console.log('删除banner失败',err)
      res.send({
        code:0,
        type:'DELETE_BANNER_FAILED',
        message: '删除焦点图失败'
      })
    }
  }
}