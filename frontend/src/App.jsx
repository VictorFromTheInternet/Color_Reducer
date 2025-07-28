import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  const [colorInputs, setColorInputs] = useState([])
  const [numColors, setNumColors] = useState(1)
  


  function handleRangeChange(e){
    setNumColors(e.target.value)
    // console.log(e)
    // console.log(numColors)

    handleColorInputs(numColors)
  }

  // handle colors arr
  function handleColorInputs(n){
    if(n > colorInputs.length){
      // push color
      setColorInputs( [...colorInputs, "#000000"])

    }else{
      // pop color 
      setColorInputs(colorInputs.slice(0,n))
    }
  }


  // submit
  function handleSubmit(){

  }

  // generate image
  function handleGenerateImage(e){
    e.preventDefault()

    colorInputs.forEach((elm)=>{
      console.log(elm)
    })
  }

  return (
    <>
      <h1>Color Reducer!</h1>

      <div className="main-container  max-w-lg ml-auto mr-auto min-h-screen">
          <div className="p-4 rounded-xl bg-white">
            <form action="">

              <div>
                <label htmlFor="numColors" className="block">How many colors:</label>
                <input type="range" id="numColors" min="1" max="10" onChange={handleRangeChange} value={numColors} />
              </div>                         

              <div>
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

              <div>
                <label htmlFor="imageUpload" className="block">Upload an Image:</label>
                <input 
                  type="file" id="imageUpload" name="imageUpload" accept="image/png, image/jpg" 
                  className="border-1 border-gray-300  rounded-md p-2 mb-3 cursor-pointer"
                  />
              </div>


              <button 
              className="text-blue-500 border-1 border-blue-500 py-2 px-4 rounded-xl cursor-pointer"
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
