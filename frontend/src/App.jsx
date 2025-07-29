import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [colorInputs, setColorInputs] = useState([])
  const [numColors, setNumColors] = useState(1)
  const [fileInput, setFileInput]  = useState('')
  

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

  // handle file
  function handleFileInput(e){
    setFileInput(e.target.files)
  }
  

  // submit
  function handleSubmit(){

  }

  // generate image
  function handleGenerateImage(e){
    e.preventDefault()

    const formData = {
      colors: colorInputs,
      inputImage: fileInput
    }

    console.log(formData)
  }

  return (
    <>
      <h1>Color Reducer!</h1>

      <div className="main-container  max-w-lg ml-auto mr-auto min-h-screen">
          <div className="p-4 rounded-xl bg-white">
            <form action="">

              <div>
                <label htmlFor="numColors" className="block">How many colors (1-10):</label>
                <div className="flex justify-between">
                  <p>1</p>
                  <p>10</p>
                </div>
                <div className="flex gap-3 justify-between">
                  <input 
                  type="range" id="numColors" min="1" max="10" onChange={handleRangeChange} value={numColors} 
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
                  type="file" id="imageUpload" name="imageUpload" accept="image/"  
                  className="text-md 
                      file:mr-5 file:py-1 file:px-3 file:border-[1px] file:rounded-md
                      file:text-xs file:font-medium
                      file:bg-stone-50
                      hover:file:cursor-pointer hover:file:bg-blue-50
                      hover:file:text-blue-500"
                  
                  onChange={(e)=>{ console.log(e.target.files); setFileInput(e.target.files)}}
                  />
              </div>


              <button 
              className="text-blue-500 border-1 border-blue-500 py-2 px-4 rounded-xl cursor-pointer hover:bg-blue-50"
              onClick={handleGenerateImage}> 
                Reduce Image 
              </button>
            </form>
          </div>
      </div>
    </>
  )
}

export default App
