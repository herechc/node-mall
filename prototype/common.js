var Ids = require('../models/ids')
import fs from 'fs'
import path from 'path'
import gm from 'gm'
import formidable from 'formidable'
// exports.base = {
//   idList:['restaurant_id','food_id','user_id','category_id'],
//   getId: async function(type){
//     if(!this.idList.includes(type)){
//       console.log('Id类型错误')
//       // throw new Error('id类型错误')
//       return
//     }
//     // try{
//     const idData = await Ids.findOne();
//     idData[type]++ ;
//     await idData.save();
//     console.log('base',idData[type])
//     return idData[type];
//     // }catch(err){
//     //   console.log('获取ID数据失败');
//     //   throw new Error(err);
//     // }
//   }
// }

export default class base {
  constructor(){
    this.idList = ['restaurant_id','food_id','user_id','category_id','img_id','banner_id','goods_id'];
    this.uploadImg = this.uploadImg.bind(this)
  }
  async getId(type){
    if(!this.idList.includes(type)){
      console.log('Id类型错误')
      return
    }
    const idData = await Ids.findOne();
    idData[type]++ ;
    await idData.save();
    return idData[type];
  }
  async uploadImg(req,res,next){
    const type = req.params.type
    try{
      const image_path = await this.getPath(req)
      res.send({
        status:1,
        image_path
      })
    }catch(err){
      console.log('上传图片失败', err)
      res.send({
        status:0,
        type:'ERROR_UPLOAD_IMG',
        message: '上传图片失败'
      })
    }
  }
  async getPath(req){
    return new Promise((resolve,reject)=>{
      //创建上传表单
      const form = formidable.IncomingForm();
      //设置上传目录
      form.uploadDir = './public/img';
      //解析
      form.parse(req, async(err,fields,files)=>{
        let img_id;
        try {
          img_id = await this.getId('img_id');
        }catch(err){
          console.log('获取图片id失败')
          //删除文件
          fs.unlink(files.file.path)
          reject('获取图片id失败')
        }
        //重命名图片
        const imgName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + img_id;
        //后缀名
        const fullName = imgName + path.extname(files.file.name)
        //图片保存的地址
        const repath = './public/img/' + fullName;
        try{
          //修改文件名称，可更改文件的存放路径(保存图片)。
          await fs.rename(files.file.path,repath)
          //对保存到服务器的图片进行裁切
          //返回剪切的图片
          gm(repath)
          .options({
            //win下使用mg会报错误，因为gm调用的命令是convert，与系统自带命令有所冲突，
            //需要配置appPath
            //配置GraphicsMagick的安装路径,避免调用command时与系统的conver冲突
            appPath:'C:\\Program Files\\GraphicsMagick-1.3.26-Q8\\'
          })
          .resize(200, 200, "!")
          .write(repath, async (err) => {
            if(err){
              console.log('裁切图片失败',err)
              reject('裁切图片失败')
              return
            }
            resolve(fullName)
          })
        }catch(err){
          console.log('保存图片失败',err)
          fs.unlink(files.file.path)
          reject('保存图片失败')
        }
      })
    })
  }
}
