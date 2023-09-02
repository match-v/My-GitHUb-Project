import express from 'express'
import postRoutes from './routes/posts.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import cookieParser from 'cookie-parser'
import multer from 'multer'

//所有中间件
const app=express()//创建一个实例

app.use(express.json())//解析请求体数据的中间件
app.use(cookieParser())//解析用户端发送过来的cookie?

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"../client/public/upload")
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+ file.originalname)//文件初始名，但是为了防止同文件名的覆盖这样写
    }
})

const upload=multer({storage:storage})

app.post("/api/upload",upload.single('file'),function(req,res){
    const file=req.file;
    res.status(200).json(file.filename)
})

app.use('/api/posts',postRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/user',userRoutes)



app.listen(8000,()=>{
    console.log('连接成功~')
})