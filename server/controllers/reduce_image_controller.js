import fs from 'fs/promises'
import {createCanvas, loadImage} from 'canvas'

// const out = fs.createWriteStream(__dirname + '/test.jpeg')
// const stream = canvas.createJPEGStream()
// stream.pipe(out)
// out.on('finish', () =>  console.log('The JPEG file was created.'))

// const canvas = createCanvas(200, 200)
// const ctx = canvas.getContext('2d')


async function reduceImageController(req, res){

    try{
        console.log(req.body)
        console.log(req.file)

        // init image
        const filePath = req.file.path
        const image = await loadImage(filePath)
        const height = image.height
        const width = image.width

        // init canvas
        const canvas = createCanvas(height, width)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0,0)

        // get pixel array
        const imageData = ctx.getImageData(0,0,width, height, {
            colorSpace: 'srgb'            
        }).data


        // round values        
        const colors = new Set(req.body.colors)
        for(let i=0; i<imageData.length/1000; i+=4){
            let R = imageData[i]
            let G = imageData[i+1]
            let B = imageData[i+2]
            let A = imageData[i+3]
            

            console.log(closestColor(colors, R, G, B, A))
            console.log(`${R}, ${G}, ${B}, ${A}`)
        }

        // console.log(imageData)

        if(!req.body){
            res.status(500).send({message:"req body missing"})
        }else{
            res.status(200).send({message: "file upload success"})
        }        
        
    }catch(err){
        console.error(err)
        res.status(500).send({message:"error uploading file"})
    }
    
}



export default reduceImageController