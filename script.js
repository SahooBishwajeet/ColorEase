const pickBtn = document.getElementById("pick-btn");
const fileInput = document.getElementById("file");
const image = document.getElementById("image");
const hexInput = document.getElementById("hex-input");
const rgbInput = document.getElementById("rgb-input");
const pickedColor = document.getElementById("picked-color");
const colorP = document.getElementById("colorPalette");

// Initialize Eyedropper if supported
const initEyeDropper = () => {
    if ("EyeDropper" in window) {
        pickBtn.classList.remove("hide");
        const eyeDropper = new EyeDropper();
        // Event listener for color selection
        pickBtn.addEventListener("click", async () => {
            try {
                const colorValue = await eyeDropper.open();
                // Convert colorValue.sRGBHex to lowercase to ensure propper parsing
                const rgbaValue = colorValue.sRGBHex.toLowerCase();
                const hexValue = rgbaToHex(rgbaValue);
                result.style.display = "grid";
                hexInput.value = rgbaValue;
                rgbInput.value = hexValue;
                pickedColor.style.backgroundColor = hexValue;
            } catch {
                alert("Unable to Pick Color!");
            }
        });
    } else {
        alert("Color Picker Not Supported!");
    }
};

const colorThief = new ColorThief();

// Event listener for file input & Color Palette Generation
fileInput.addEventListener("change", (e) => {
    result.style.display = "none";
    const reader = new FileReader();
    reader.onload = () => image.setAttribute("src", reader.result);
    reader.readAsDataURL(fileInput.files[0]);

    const file = e.target.files[0];
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.addEventListener('load', () => {
        // const colorPArr = Array.from(colorP);
        // colorPArr.forEach((c) => {
        //     c.classList.remove("hide");
        // });
        // colorP.classList.remove("hide");
        colorP.style.display = "flex";
        const colors = colorThief.getPalette(img, 8); // Adjust the number of colors you want in the palette

        colors.forEach((color, index) => {
          const div = document.getElementById(String(index + 1));
          if(div) { 
            div.style.backgroundColor = rgbaToHex(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 00)`);
            div.textContent = rgbaToHex(`rgba(${color[0]}, ${color[1]}, ${color[2]}, 00)`);
          }
        });
    });
});

// Function to copy text to clipboard
const copyToClipboard = (textId) => {
    const textElement = document.getElementById(textId);
    textElement.select();
    document.execCommand("copy");
};

// RGBA conversion to hex function
const rgbaToHex = (rgba) => {
    const parts = rgba.slice(5, -1).split(",");
    const r = parseInt(parts[0].trim(), 10);
    const g = parseInt(parts[1].trim(), 10);
    const b = parseInt(parts[2].trim(), 10);

    // Convert the RGB values to hexadecimal
    const hexR = r.toString(16).padStart(2, "0");
    const hexG = g.toString(16).padStart(2, "0");
    const hexB = b.toString(16).padStart(2, "0");

    // Combine the hex values
    const hexColor = `#${hexR}${hexG}${hexB}`;

    return hexColor;
};

// Initialize Eyedropper
window.onload = initEyeDropper;