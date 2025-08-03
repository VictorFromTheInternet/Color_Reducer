import fs from 'fs/promises'
import {createCanvas, loadImage} from 'canvas'
import {hexToRgb, closestColor} from './color_utility.js' 
import { Buffer } from 'node:buffer'


async function reduceImageController(req, res){    

    try{        
        // init image
        const filePath = req.file.path
        const image = await loadImage(filePath)

        const height = await image.height
        const width = await image.width        

        // init canvas
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0,0)

        // get pixel array
        const imageData = ctx.getImageData(0,0,width, height, {
            colorSpace: 'srgb'            
        }).data


        // round values        
        const colors = req.body.colors.split(',')        
        for(let i=0; i<imageData.length; i+=4){
            let R = imageData[i]
            let G = imageData[i+1]
            let B = imageData[i+2]
            let A = imageData[i+3]            

            const [newR, newG, newB, newA] = hexToRgb(closestColor(colors, R,G,B))            
            
            imageData[i] = newR
            imageData[i+1] = newG
            imageData[i+2] = newB
            
            // console.log(`${newR}, ${newG}, ${newB}, ${newA}`)
            // console.log("Closest color:",closestColor(colors, R, G, B))            
        }        

        // create or store new image, send to client
        console.log(imageData)        
        res.status(200).send({
            "imageData": Buffer.from(imageData),
            "height": height,
            "width":width
        })
             

        // clean up 
        await fs.unlink(filePath)
        // console.log(`Deleted file: ${filePath}`)
        
    }catch(err){
        console.error(err)
        res.status(500).send({message:"error uploading file"})
        await fs.unlink(filePath)
        // console.log(`Deleted file: ${filePath}`)
    }
    
}



export default reduceImageController