//服务器处理
import bcrypt from 'bcryptjs';
import { db } from "../db.js"
import jwt from 'jsonwebtoken'

export const register=(req,res)=>{
    const q='select * from users where email=? or username=?'//查询用户名或者id

    db.query(q,[req.body.email,req.body.name],(err,data)=>{
        if(err){return res.json(err)};
        if(data.length) return res.status(409).json('用户已经存在！');

        const salt=bcrypt.genSaltSync(10);
        const hash=bcrypt.hashSync(req.body.password,salt)

        const q='insert into users(`username`,`email`,`password`) values(?)'
        const values=[
            req.body.username,
            req.body.email,
            hash
        ]

        db.query(q,[values],(err,data)=>{
            if(err){return res.json(err)};
            return res.status(200).json('用户创建成功，您已成为新用户~'); 
        })


    })

}
export const login=(req,res)=>{
    const q='select * from users where username=?';
    db.query(q,[req.body.username],(err,data)=>{
        if(err){return res.json(err)};
        if(data.length===0) return res.status(404).json('此用户不存在！')

        const isPasswordCorrect=bcrypt.compareSync(req.body.password,data[0].password);//请求体密码与数据库密码相比较
        //这里的密码比较只能原密码与数据库加密后的比？
        if(!isPasswordCorrect) return res.status(400).json('用户名或密码错误！')

        const token=jwt.sign({id:data[0].id},'jwtkey')//1
        const {password,...other}=data[0]

        res.cookie('access_token',token,{
            httpOnly:true//浏览器中的任何脚本和其他的申请都无法直接访问cookie,仅发出api请求时访问
        }).status(200).json(other)//不放密码


    })
    
}
export const logout=(req,res)=>{
    res.clearCookie("access_token",{
        sameSite:"none",
        secure:true
    }).status(200).json("用户已退出登录")

    
}