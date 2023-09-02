import jwt from 'jsonwebtoken'
import { db } from "../db.js"

export const getPosts=(req,res)=>{
    const q=req.query.cat ? "select * from posts where cat=?":"select * from posts"
    db.query(q,[req.query.cat],(err,data)=>{
        if(err) return res.status(500).send(err);
         
        return res.status(200).json(data)
    })
}

export const getPost=(req,res)=>{
    const q= "SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ";
    // "select p.id, `username`,`title`,`desc`,p.img,u.image as userImage,`cat`,`date`from users u join posts p on u.id=p.uid where p.id=?"
    db.query(q,[req.params.id],(err,data)=>{
        //console.log(data)
        if(err) return res.status(500).json(err)
       
        return res.status(200).json(data[0])
    })
}

export const addPost=(req,res)=>{
    const token=req.cookies.access_token;
    if(!token) return res.status(401).json("没有被授权！")

    jwt.verify(token,"jwtkey",(err,userInfo)=>{
        if(err) return res.status(403).json('token is not valid')

        const q="INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";
        const values=[
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
            req.body.date,
            userInfo.id
        ]
        db.query(q,[values],(err,data)=>{
            if(err) return res.status(403).json(err)
            return res.json("帖子创建成功！")

        })


    })
}

export const deletePost=(req,res)=>{
    const token=req.cookies.access_token;
    if(!token) return res.status(401).json("没有被授权！")

    jwt.verify(token,"jwtkey",(err,userInfo)=>{
        if(err) return res.status(403).json('token is not valid')

    const postId=req.params.id;
    const q="delete from posts where `id`=? and `uid`=?"

    db.query(q,[postId,userInfo.id],(err,data)=>{
        if (err) return res.status(403).json('你只能删除自己的帖子！')
        return res.json('帖子已被删除~')
    })
    })
}

export const updatePost=(req,res)=>{
    const token=req.cookies.access_token;
    if(!token) return res.status(401).json("没有被授权！")

    jwt.verify(token,"jwtkey",(err,userInfo)=>{
        if(err) return res.status(403).json('token is not valid')

            const postId=req.params.id
        const q="UPDATE posts set `title`=?, `desc`=?, `img`=?, `cat`=?where `id`=? and`uid`=?";
        const values=[
            req.body.title,
            req.body.desc,
            req.body.img,
            req.body.cat,
        ]
        db.query(q,[...values,postId,userInfo.id],(err,data)=>{
            if(err) return res.status(403).json(err)
            return res.json("帖子更新成功！")

        })


    })
}