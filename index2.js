const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Employee = require('./models/Employee')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
app.use(express.json())
const JWT_SECRET_KEY = 'Bhanu@123'




app.post('/register',async(req, res)=>{
  const {name,email,password} = req.body
  console.log(name,email,password)

  const hashedPassword = await bcrypt.hash(password,10)
  console.log(hashedPassword)

  const newUser = new Employee({
    name,
    email,
    password : hashedPassword
  })

  await newUser.save()

  res.status(200).json({
    message : 'Successfully user register'
  })

})

app.post('/login',async(req, res)=>{
  const {email,password} = req.body

  const user = await Employee.findOne({email})
  console.log(user)

  const isMatch = await bcrypt.compare(password, user.password)
  // console.log(isMatch)

  if(!isMatch){
    return res.json({
      message : 'Invalid email or password'
    })
  }

  const token = jwt.sign(
    {userId : user._id, email : user.email},
    JWT_SECRET_KEY,
    {expiresIn : '1hr'}
  )

  // console.log(token)

  console.log(email,password)
  res.status(200).json({
    message : 'sucessfully user logined',
    token : token
  })
})

function verifyToken(req,res,next){
  console.log('middleware')
  const authHeader = req.headers.authorization

  if(!authHeader || !authHeader.startsWith('Bearer ')){
    return res.json({
      message : 'Access denied. No Token provided'
    })
  }

  const token = authHeader.split(' ')[1]

  const decodeToken = jwt.verify(token,JWT_SECRET_KEY)
  console.log(decodeToken)

  const {userId} = decodeToken
  
  req.user = decodeToken
  next()
}

app.post('/profile',verifyToken,async(req, res)=>{
  console.log(req.user)

  const {userId} = req.user

  const user = await Employee.findById(userId)
  console.log(user)



  res.end({
    message : 'successfully user '
  })
})


app.use('/',(req,res)=>{
  res.end('Home')
})


mongoose.connect('mongodb+srv://bhanuprasadsuram0018:Suram%40143@cluster0.enfq1.mongodb.net/employeeDB?retryWrites=true&w=majority&appName=Cluster0')
.then(response =>{
  console.log('sucessfully connected mongoDB')
})
.catch(err =>{
  console.log('failed to connect to mongoDB')
})

app.listen(3000,()=>{
  console.log('server is runnig on port 3000')
})