import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [colorInputs, setColorInputs] = useState([])
  const [numColors, setNumColors] = useState(1)
  const [fileInput, setFileInput]  = useState('')
  const [processedImageData, setProcessedImageData] = useState()
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
  
  

  // submit
  function handleSubmit(){

  }

  // generate image
  async function handleGenerateImage(e){
    e.preventDefault()

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
      const url = `http://localhost:5000/color-reducer-api/reduce-image`
      const options = {
        method: 'POST',      
        body: formData
      }
      const response = await fetch(url, options)    
      const data = await response.json()       
      let imageData = new Uint8ClampedArray(data.imageData.data)

      console.log(typeof imageData)     
      console.log(imageData)
      // let imageArray = new Uint8ClampedArray(data.imageData.length)
      // data.imageData.forEach((elm, ind) => imageArray[ind] = elm)
      // console.log(imageArray)
      // const imageArray = new Uint8ClampedArray(data.imageData)
      // console.log(typeof imageArray)
      // console.log(imageArray)
      // setProcessedImageData(data.imageData)

      // Draw the processed image on canvas
      drawImageOnCanvas(imageData, data.width, data.height)
    }catch(err){
      console.error(err)
    }


    // console.log(formData)
    // console.log(data)
  }

  // Function to draw image data on canvas
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




  return (
    <>
      {/* <h1>Color Reducer!</h1> */}

      <div className="main-container  max-w-lg ml-auto mr-auto min-h-screen flex flex-col justify-center items-center">
          <div className="p-4 rounded-xl bg-white min-w-full">
            <form action="">

              <div>
                <label htmlFor="numColors" className="block">How many colors (1-10):</label>
                <div className="flex justify-between">
                  <p>1</p>
                  <p>10</p>
                </div>
                <div className="flex gap-3 justify-between">
                  <input 
                  type="range" id="numColors" min="1" max="10" onChange={handleRangeChange} value={numColors} required
                  className="w-full"
                  />
                  <span>{numColors}</span>
                </div>        
              </div>                         

              <div className="mb-3">
                {
                  colorInputs.map((elm, ind)=>{
                    return(
                      <input type="color" 
                      key={ind}
                      id={ind}
                      value={elm.value} 
                      onChange={(e)=>{
                        let newInputs = [...colorInputs ]
                        newInputs[ind] = e.target.value
                        setColorInputs(newInputs)
                      }}/>
                    )
                  })
                }
              </div>

              <div className="mb-4">
                <label htmlFor="imageUpload" className="block">Upload an Image:</label>
                <input 
                  type="file" id="imageUpload" name="imageUpload" accept="image/jpeg"  required
                  className="text-md 
                      file:mr-5 file:py-1 file:px-3 file:border-[1px] file:rounded-md
                      file:text-xs file:font-medium
                      file:bg-stone-50
                      hover:file:cursor-pointer hover:file:bg-blue-50
                      hover:file:text-blue-500"
                  
                  onChange={(e)=>{ console.log(e.target.files[0]); setFileInput(e.target.files[0])}}
                  />
              </div>              

              <button 
              className="text-blue-500 border-1 border-blue-500 py-2 px-4 rounded-xl cursor-pointer hover:bg-blue-50"
              onClick={handleGenerateImage}> 
                Reduce Image 
              </button>
            </form>

            {
              fileInput &&
              <div className="bg-gray-200 my-4 overflow-x-auto overflow-y-auto max-h-sm">
                <canvas id="canvas" ref={canvasRef} width={fileInput.width} height={fileInput.height}></canvas>
              </div>
            }

          </div>
      </div>
    </>
  )
}

export default App
