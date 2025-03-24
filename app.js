const express= require('express')
const app = express()
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URL).then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server running on PORT ${PORT}`)
  })
}).catch((err)=>{
  console.log(err)
})

