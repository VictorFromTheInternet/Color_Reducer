
async function reduceImageController(req, res){
    console.log(req.body)
    console.log(req.file)

    try{
        if(!req.body){
            res.status(500).send({message:"error uploading file"})
        }else{
            res.status(200).send({message:"file upload success"})
        }        
        
    }catch(err){
        res.status(500).send({message:"error uploading file"})
    }
    
}

export default reduceImageController