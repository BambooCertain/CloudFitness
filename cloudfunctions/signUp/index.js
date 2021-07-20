// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('uUsers').where({
      openID:event.openID
    }).update({
      // data 传入需要局部更新的数据
      data: {
        uDepart: event.uDepart,
        uTel: event.uTel,
        uName: event.uName,
        uNumber: event.uNumber,
      }
    })
  } catch (e) {
    console.error(e)
  }
}



//const cloud = require('wx-server-sdk')

//cloud.init()

// 云函数入口函数
/*exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return cloud.database().collection("uUsers").add({
      data: {
        uDepart: event.uDepart,
        uTel: event.uTel,
        uName: event.uName,
        uNumber: event.uNumber,
        openID: event.openID,
        nickName: event.nickName,
        avatarUrl: event.avatarUrl,
        stepLists: []
      },
      success: res => {
        return res
      }
    })
  }*/