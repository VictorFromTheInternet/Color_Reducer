// event listener for the numColors range input (append/remove color inputs)
document.getElementById("num-colors").addEventListener("input", ()=>{
    numColorInputs = document.querySelectorAll(".color-input").length
    numColors = Number(document.getElementById("num-colors").value)

    if(numColors > numColorInputs)
        appendColorInputs(numColors)
    else if(numColors < numColorInputs)
        removeColorInputs(numColors)
})

function appendColorInputs(numColors){
    // update label    
    let label = document.getElementById('num-colors-range-label') 
    label.innerText = `${numColors}`

    // grab curr length & input and then add the diff ()
    let colorInputsList = document.querySelectorAll(".color-input")
    let currLen = colorInputsList.length
    console.log(colorInputsList)


    for(let i=currLen; i<numColors; i++){
        let tempElem = document.createElement("input");
        tempElem.type = "color"
        tempElem.classList.add("form-control")
        tempElem.classList.add("form-control-color")
        tempElem.classList.add("color-input")
        tempElem.id = `colorInput${i}`
        document.getElementById("color-inputs-container").append(tempElem);
        //colorInputsArr.append(colorInput)
    }
}
function removeColorInputs(numColors){

    // update label
    let label = document.getElementById('num-colors-range-label') 
    label.innerText = `${numColors}`

    // grab curr length and then iterate backwards
    let colorInputsList = document.querySelectorAll(".color-input")
    let currLen = colorInputsList.length

    for(let i=currLen; i>numColors; i--){        
        let tempId = `colorInput${i-1}`
        //console.log(tempId)
        //console.log(document.getElementById(`colorInput${i-1}`))


        let tempElem = document.getElementById(tempId)
        tempElem.remove()        
    }
}

// collect color inputs and push to array
function getColorInputValues(){
    // query selector, all 
    let tempArray = new Array()
    let colorInputsList = document.querySelectorAll('.color-input')
    //console.log(colorInputsList)

    for(let i=0; i<colorInputsList.length; i++){        
        let tempId = `colorInput${i}`
        // console.log(tempId)
        // console.log(document.getElementById(tempId))
        // console.log(document.getElementById(tempId).value)

        let tempValue = document.getElementById(tempId).value
        tempValue = hexToRgb(tempValue)
        tempArray.push(tempValue) 
    }

    //console.log(tempArray)
    return tempArray
}