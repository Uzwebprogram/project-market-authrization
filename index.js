const express = require("express")
const app = express()
const port = process.env.PORT || 8000
const {read , write} = require("./lib/FS")
const path = require("path")
const cors = require('cors')
const { verify, sign } = require('jsonwebtoken')

app.use(express.json())
app.use(cors())
app.post("/login" , (req ,res) =>{
    const { email , password ,tel } = req.body

    const foundUser = read(path.resolve("./model/users.json")).find(e =>( e.email == email || e.tel == tel )&& e.password == password)
    
    if(!foundUser) {
        return res.status(401).json("Незарегистрированный пользователь")
    }
    const accsesToken = sign({id : foundUser.id}, 'SECRET_KEY')

    res.status(200).json({
        accsesToken
    })
})

app.post("/registar" , (req, res) =>{
    const {email, tel, password, name} = req.body

    const foundUser = read(path.resolve("./model/users.json")).find(e => e.email == email && e.tel == tel)

    if(foundUser) {
        return res.status(400).send("User exists")
    }

    const allUsers = read(path.resolve("./model/users.json"))

    allUsers.push({id : allUsers.length + 1 ,name, email , tel , password }) 

    const accsesToken = sign({ id : allUsers.length + 1 }, 'SECRET_KEY')

    write(path.resolve("./model/users.json"), allUsers)

    res.status(200).json({
        accsesToken
    }) 
})

app.get("/registar" , (req ,res)=>{
    res.send(read(path.resolve("./model/users.json")))
})
app.get("/registar/:id" , (req , res)=>{
    const { id } = req.params
    const registerId = read(path.resolve("./model/users.json")).find(e => e.id = id)
    res.send(registerId)
})
app.put('/registar' , (req, res) => {
    const { id,email , tel , password ,name} = req.body

    const arr = read(path.resolve('./model/users.json'))

    const found = arr.findIndex(e => e.id == id)
    const find = arr.find(e => e.id == id)

    find.email = email ? email : find.email
    find.tel = tel ? tel : find.tel
    find.password = password ? password : find.password
    find.name = name ? name : find.name
    arr.splice(found, 1, find)

    write(path.resolve('./model/users.json'), arr)
    
    res.send("edit user")
})
app.delete(`/registar`, (req, res) => {
    const { id } = req.body

    const arr = read(path.resolve('./model/users.json'))

    const found = arr.findIndex(e => e.id == id)

    arr.splice(found, 1)

    write(path.resolve('./model/users.json'), arr)

    res.send("delete user")
})
app.listen(port , console.log(port));
