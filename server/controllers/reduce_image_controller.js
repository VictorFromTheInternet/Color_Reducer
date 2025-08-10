import fs from 'fs/promises'
import {createCanvas, loadImage} from 'canvas'
import {hexToRgb, closestColor} from './color_utility.js' 
import { Buffer } from 'node:buffer'


async function reduceImageController(req, res){    

    try{        
        // init image
        const filePath = req.file.path
        const image = await loadImage(filePath)

        const height = image.height
        const width = image.width        

        // init canvas
        const canvas = createCanvas(width, height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0,0)

        // get selected colors
        const colors = req.body.colors.split(',')   

        // get pixel array
        let imageData = ctx.getImageData(0,0,width, height, {
            colorSpace: 'srgb'            
        }).data
        
        // create reference Map / stack           
        let refSet = new Map()             
    
        // O(N)/4 ish - assign rounded values
        for(let i=0; i<imageData.length; i+=4){
            let R = imageData[i]
            let G = imageData[i+1]
            let B = imageData[i+2]
            let A = imageData[i+3]        

            let newColor = []
            
            if(refSet.has(`rgba(${R},${G},${B},${A})`)){
                newColor = refSet.get(`rgba(${R},${G},${B},${A})`)
            }else{
                newColor = hexToRgb(closestColor(colors, R,G,B))
                refSet.set(`rgba(${R},${G},${B},${A})`, newColor)
            }                    
            
            imageData[i] = newColor[0]
            imageData[i+1] = newColor[1]
            imageData[i+2] = newColor[2]
            
            // console.log(`${newR}, ${newG}, ${newB}, ${newA}`)
            // console.log("Closest color:",closestColor(colors, R, G, B))            
        }        

        // create or store new image, send to client
        // console.log(imageData)        
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