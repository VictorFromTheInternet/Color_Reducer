import express from 'express'
const router = express.Router()
import multer from 'multer'
import reduceImageController from '../controllers/reduce_image_controller.js'

const upload = multer({dest: 'uploads/'})


router.get('/', (req,res)=>{
    res.send({message:"Hello World"})
})

router.post('/reduce-image', upload.single('inputImage'), reduceImageController)

export default router