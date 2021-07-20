const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
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