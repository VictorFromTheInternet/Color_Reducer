// using distance fomula 
// sqrt( (r1-r2)^2 + (g1-g2)^2 + (b1-b2)^2 )
function closestColor(colors, r1,g1,b1){
    let closestColor = colors[0]     
    let min = 500
    
    for(let i=0; i<colors.length; i++){
        let [r2, g2, b2, a2] = hexToRgb(colors[i])   
        let temp = Math.sqrt( 
                Math.pow((r1-r2),2) + 
                Math.pow((g1-g2),2) + 
                Math.pow((b1-b2),2) )

        console.log(temp)
        if(min > temp){
            min = temp
            closestColor = colors[i]
        }
    }

    return closestColor
}
const tempColors = ['#000000', '#090909','#FFFFFF']
console.log(closestColor(tempColors, 255, 255, 255))

function hexToRgb(str){
    let R = parseInt(str.slice(1,3), 16)
    let G = parseInt(str.slice(3,5), 16)
    let B = parseInt(str.slice(5), 16)
    let A = 1
    console.log(`${R}, ${G}, ${B}, ${A}`)
    return [R,G,B,A]
}
// console.log(hexToRgb('#ffffff'))



// export default {hexToRgb, closestColor}