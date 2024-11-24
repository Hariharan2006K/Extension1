document.addEventListener("DOMContentLoaded", () => {
    const colorPickerBtn = document.querySelector("#color-picker");
    const colorList = document.querySelector(".all-colors");
    const clearAll = document.querySelector(".clear-all");

    const pickedColors = JSON.parse(localStorage.getItem("picked-colors") || "[]");

    const showToast = (message) => {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "#333";
        toast.style.color = "#fff";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "5px";
        toast.style.fontSize = "0.9rem";
        toast.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.2)";
        toast.style.opacity = "0";
        toast.style.transition = "opacity 0.3s ease";

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "1";
        }, 100);

      
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 2000);
    };

    const showColors = () => {
        if (pickedColors.length === 0) {
            colorList.innerHTML = "<p>No colors picked yet.</p>";
            return;
        }

        const liTag = pickedColors
            .map(
                (color) => `
            <li class="colors">
                <span class="rect" style="background: ${color}"></span>
                <span class="value" data-color="${color}">${color}</span>
            </li>`
            )
            .join("");

        colorList.innerHTML = liTag;

        document.querySelectorAll(".value").forEach((element) => {
            element.addEventListener("click", () => {
                const color = element.getAttribute("data-color");
                navigator.clipboard.writeText(color).then(() => {
                    showToast("COPIED!");
                });
            });
        });
    };

    const activateEyeDropper = async () => {
        try {
            const eyeDropper = new EyeDropper();
            const { sRGBHex } = await eyeDropper.open();
            await navigator.clipboard.writeText(sRGBHex);

            pickedColors.push(sRGBHex);
            localStorage.setItem("picked-colors", JSON.stringify(pickedColors));
            showColors();
        } catch (error) {
            console.log(error);
        }
    };

    const clearAllColors = () => {
        localStorage.removeItem("picked-colors");
        pickedColors.length = 0; // Clear the array
        showColors();
    };

    colorPickerBtn.addEventListener("click", activateEyeDropper);
    clearAll.addEventListener("click", clearAllColors);
    showColors();
});
