'use strict'
const log = require('./logger')

function encryptId(str, key){
  if(!str || !key) return
  return CryptoJS.AES.encrypt(str, key).toString()
}
function decryptId(str, key){
  if(!str || !key) return
  return CryptoJS.AES.decrypt(str, key).toString(CryptoJS.enc.Utf8)
}

module.exports = class {
  constructor({ mongo, collection, encryptionKey }){
    if(!mongo || !collection || !encryptionKey) throw `missing db info`
    this._mongo = mongo, this._collection = collection, this._cache_ready = false, this.encryption_key = encryptionKey
    this._init()
  }
  _init(){
    try{
      if(this._mongo.status()){
        this._cache_ready = true
        return log.info('cache ready')
      }
      setTimeout(()=>this._init(), 5000)
    }catch(e){
      log.error(e)
      setTimeout(()=>this._init(), 5000)
    }
  }
  async get(key){
    try{
      if(!key || !this._cache_ready) return
      let obj = await this._mongo.get( this._collection, { _id: key } )
      if(!obj?.data) return

      let decryptedStr = decryptId(obj?.data, this.encryption_key)
      if(decryptedStr) return JSON.parse(decryptedStr)
    }catch(e){
      log.error(e)
    }
  }
  async set(key, data){
    try{
      if(!key || !data || !this._cache_ready) return
      let encryptedStr = encryptId(JSON.stringify(data), this.encryption_key)
      if(!encryptedStr) return

      return await this._mongo.set( this._collection, { _id: key }, { data: encryptedStr })
    }catch(e){
      log.error(e)
    }
  }
  async del(key){
    try{
      await this._mongo.del( this._collection, { _id: key })
      return true
    }catch(e){
      log.error(e)
    }
  }
  status(){
    return this._cache_ready
  }
}
