const cloud = require('wx-server-sdk')

cloud.init()

// const db = cloud.database({ env: 'bill1902-online-9c3e8c' })
const db = cloud.database({ env: 'bill1902-text-d05f84' })

exports.main = async (event, context) => {
  try {
    return await db.collection('bills').where({
      bookid: event.bookid
    }).remove()
  } catch (e) {
    console.error(e)
  }
}