import express from "express";
import { register ,login,logout} from "../controllers/auth.js";


//分别的路由请求方式
const router=express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/logout',logout)

export default router