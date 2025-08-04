import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoadingSpinner from './components/LoadingSpinner'

function App() {

  const [colorInputs, setColorInputs] = useState([])
  const [numColors, setNumColors] = useState(1)
  const [fileInput, setFileInput]  = useState(null)
  const [processedImageData, setProcessedImageData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef()
  

  // handle colors arr
  function handleRangeChange(e){
    setNumColors(e.target.value)
    handleColorInputs(e.target.value)
  }

  function handleColorInputs(n){
    console.log(n)
    const diff = n-colorInputs.length
    if(diff > 0){
      // push color
      let tempArr = []
      for(let i=0; i<diff; i++){
        tempArr.push('#000000')
      }    
      
      setColorInputs( [...colorInputs, ...tempArr])

    }else{
      // pop color       
      console.log(colorInputs.slice(0,n))
      setColorInputs(colorInputs.slice(0,n))
    }
  }
  

  // handle image input
  function handleImageInput(e){
    console.log(e.target.files[0]); 
    setFileInput(e.target.files[0])

    const imageUrl = URL.createObjectURL(e.target.files[0])
    const img = new Image();

    img.onload = () =>{
      drawOriginalImageOnCanvas(img)
      URL.revokeObjectURL(imageUrl)
    }
    
    
    img.src = imageUrl
  }
  

  // submit
  function handleSubmit(){

  }

  // generate image
  async function handleGenerateImage(e){
    e.preventDefault()
    setIsLoading(true)

    // Check if form is valid using HTML5 validation
    const form = e.target.closest('form')
    if (!form.checkValidity()) {
      form.reportValidity() // This will show validation messages
      return
    }

    // Additional custom validation
    if (!fileInput) {
      alert('Please select an image file')
      return
    }

    if (colorInputs.length === 0) {
      alert('Please select at least one color')
      return
    }

    const formDataTemp = {
      colors: colorInputs,
      inputImage: fileInput
    }
    const formData = new FormData()
    
    // Object.entries(formDataTemp).forEach(([key,value], index)=>{
    //   console.log(`${key} : ${value}`)
    //   formData.append(key,value)
    // })
    formData.append('colors', colorInputs)
    formData.append('inputImage', fileInput)

    try{
      const ENV = import.meta.env.MODE       
      const url = (ENV == 'development') ? 
          'http://localhost:5000/color-reducer-api/reduce-image' :
          `https://color-reducer-server.onrender.com/color-reducer-api/reduce-image`
          
      const options = {
        method: 'POST',      
        body: formData
      }
      const response = await fetch(url, options)    
      const data = await response.json()       
      let imageData = new Uint8ClampedArray(data.imageData.data)

      // console.log(typeof imageData)     
      // console.log(imageData)      

      // Draw the processed image on canvas
      drawImageOnCanvas(imageData, data.width, data.height)
    }catch(err){
      console.error(err)
    }finally{
      setIsLoading(false)
    }


    // console.log(formData)
    // console.log(data)
  }

  // Function to draw image data on canvas (buffer data)
  function drawImageOnCanvas(imageDataArray, width, height) {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    
    // Create ImageData object from the array
    const imageData = new ImageData(imageDataArray, width, height)
    
    // Draw the image data on canvas
    ctx.putImageData(imageData, 0, 0)
  }

  // funtion to draw image on canvas (jpg)
  function drawOriginalImageOnCanvas(img){
    const canvas = canvasRef.current
    if(!canvas) return

    canvas.width = img.width
    canvas.height = img.height

    const ctx = canvas.getContext("2d")
    ctx.clearRect(0,0,canvas.width, canvas.height)
    ctx.drawImage(img,0,0)
  }





  return (
    <>
      {/* <h1>Color Reducer!</h1> */}

      <div className="p-0 sm:px-4 sm:py-8 min-h-screen flex flex-col justify-center items-center max-w-[70vw] mx-auto w-[90vw] sm:max-w-[70vw] sm:w-auto">
          <div className="p-4 sm:p-6 rounded-xl bg-white w-full shadow-lg">
            <form action="">

              <div className="mb-4">
                <label htmlFor="numColors" className="block text-sm sm:text-base mb-2">How many colors (1-10):</label>
                <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                  <p>1</p>
                  <p>10</p>
                </div>
                <div className="flex gap-3 justify-between items-center">
                  <input 
                  type="range" id="numColors" min="1" max="10" onChange={handleRangeChange} value={numColors} required
                  className="flex-1"
                  />
                  <span className="text-sm sm:text-base font-medium min-w-[2rem] text-center">{numColors}</span>
                </div>        
              </div>                         

              <div className="mb-4">
                <label className="block text-sm sm:text-base mb-2">Select Colors:</label>
                <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {
                    colorInputs.map((elm, ind)=>{
                      return(
                        <input type="color" 
                        key={ind}
                        id={ind}
                        value={elm} 
                        className="w-full h-10 sm:h-12 rounded-md cursor-pointer border border-gray-300"
                        onChange={(e)=>{
                          let newInputs = [...colorInputs ]
                          newInputs[ind] = e.target.value
                          setColorInputs(newInputs)
                        }}/>
                      )
                    })
                  }
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="imageUpload" className="block text-sm sm:text-base mb-2">Upload an Image:</label>
                <input 
                  type="file" id="imageUpload" name="imageUpload" accept="image/jpeg"  required
                  className="w-full text-sm sm:text-base
                      file:mr-3 file:py-2 file:px-4 file:border file:rounded-md
                      file:text-xs sm:file:text-sm file:font-medium
                      file:bg-stone-50 file:text-gray-700
                      hover:file:cursor-pointer hover:file:bg-blue-50
                      hover:file:text-blue-500 file:transition-colors"
                
                  onChange={(e)=>{ handleImageInput(e)}}
                  />
              </div>              

              <button 
              className="flex gap-2 items-center justify-center w-full sm:w-auto text-blue-500 border border-blue-500 py-3 px-6 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors font-medium text-sm sm:text-base"
              onClick={handleGenerateImage} disabled={isLoading}> 
                {isLoading && <LoadingSpinner/>}
                {isLoading ? 'Loading ...':'Reduce Image'}
              </button>
            </form>

            {
              fileInput &&
              <div className="bg-gray-200 my-4 p-4 rounded-lg max-w-full overflow-auto max-w-[70vw] max-h-[50vh]">
                <canvas 
                  id="canvas" 
                  ref={canvasRef} 
                  className="max-w-full h-auto"
                  width={fileInput.width} 
                  height={fileInput.height}
                ></canvas>
              </div>
            }

          </div>
      </div>
    </>
  )
}

export default App
