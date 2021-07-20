// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return await db.collection('prizes').where({
      _id: event.pid
    }).update({
      // data 传入需要局部更新的数据
      data: {
        prizeRemain: event.pRemain,
      }
    })
  } catch (e) {
    console.error(e)
  }
}