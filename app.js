//GLOBAL
const colorDivs = document.querySelectorAll(".color")
const generateBtn = document.querySelector(".generate")
const sliders = document.querySelectorAll("input[type='range']")
const currentHexes = document.querySelectorAll(".color h2")

let initialColors;

sliders.forEach(slider => {
    slider.addEventListener("input", hslControls)
})

colorDivs.forEach((div, i) => {
    div.addEventListener("change", () => {
        updateTextUI(i)
    })
})



//FUNCTIONS

//Generates random color with Chroma JS
function generateHex() {
    const hexColor = chroma.random()
    return hexColor
}

//Adds color to background + color name to div
function randomColors() {
    //Gets reference of base color
    initialColors = []

    colorDivs.forEach((div, i) => {
        const hexText = div.children[0]
        const randomColor = generateHex()
        //Adds initial color to array for each different div
        initialColors.push(chroma(randomColor).hex())

    div.style.backgroundColor = randomColor
    hexText.innerText = randomColor

    //Checks contrast
    checkTextContrast(randomColor, hexText)

    //Initial colorize sliders
    const color = chroma(randomColor)
    const sliders = div.querySelectorAll(".sliders input")
    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]
    
    //Colorizes sliders/input depending on other input values
    colorizeSliders(color, hue, brightness, saturation);
    })

    //Resets inputs
    resetInputs()
}

//Checks text contrast with Chroma JS comparing bg color & text color
function checkTextContrast(color, text){
    const luminance = chroma(color).luminance()
    if (luminance > 0.5) {
        text.style.color = "black"
    } else {
        text.style.color = "white"
    }
}

function colorizeSliders(color, hue, brightness, saturation){
    //Scales saturation with Chroma JS scale -> check documentation
    const noSaturation = color.set("hsl.s", 0)
    const fullSaturation = color.set("hsl.s", 1)
    const scaleSaturation = chroma.scale([noSaturation, color, fullSaturation])

    //Scales brightness (we get mid because we know that full and no are black and white)
    const midBrightness = color.set("hsl.l", 0.5)
    const scaleBrightness = chroma.scale(["black", midBrightness, "white"])

    //No need to scale hue -> we give absolute values below

    //Updates input colors
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSaturation(0)}, ${scaleSaturation(0.5)}, ${scaleSaturation(1)})`
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBrightness(0)}, ${scaleSaturation(0.5)}, ${scaleBrightness(1)})`
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204, 204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`
}


function hslControls(e) {
    //gets info to know which slider is being modified
    const index =
    e.target.getAttribute("data-brightness") ||
    e.target.getAttribute("data-saturation") ||
    e.target.getAttribute("data-hue");

    let sliders = e.target.parentElement.querySelectorAll("input[type='range']");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    //gets info from each div base color from initialColors array
    const bgColor = initialColors[index];

    //Uses Chroma Js to manipulate and modify the HSL values of bgColor
    let color = chroma(bgColor)
        .set("hsl.s", saturation.value)
        .set("hsl.l", brightness.value)
        .set("hsl.h", hue.value);

    //Gives each colorDiv background color based on let color
    colorDivs[index].style.backgroundColor = color;

  //Colorizes slider input based on other input values
  colorizeSliders(color, hue, brightness, saturation)
}

function updateTextUI(i) {
    const activeDiv = colorDivs[i]
    const color = chroma(activeDiv.style.backgroundColor)
    const textHex = activeDiv.querySelector("h2")
    const icons = activeDiv.querySelectorAll(".controls button")

    //Updates text with color resulting from slider, getting it from the background color
    textHex.innerText = color.hex()

    //Check text contrast
    checkTextContrast(color, textHex)
    for(icon of icons) {
        checkTextContrast(color, icon)
    }
}

function resetInputs() {
    const sliders = document.querySelectorAll(".sliders input")

    //Adjusts sliders values based on the corresponding attributes and initial colors
    sliders.forEach(slider => {
        if (slider.name === "hue") {
            const hueColor = initialColors[slider.getAttribute("data-hue")]
            const hueValue = chroma(hueColor).hsl()[0]
            slider.value = Math.floor(hueValue)
        }

        if (slider.name === "brightness") {
            const brightnessColor = initialColors[slider.getAttribute("data-brightness")]
            const brightnessValue = chroma(brightnessColor).hsl()[2]
            slider.value = Math.floor(brightnessValue * 100) / 100
        }

        if (slider.name === "saturation") {
            const saturationColor = initialColors[slider.getAttribute("data-saturation")]
            const saturationValue = chroma(saturationColor).hsl()[1]
            slider.value = Math.floor(saturationValue * 100) / 100
        }
    })
}


randomColors()