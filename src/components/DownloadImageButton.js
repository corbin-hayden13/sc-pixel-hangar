function onButtonClick({canvas}) {
    const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "sc_pixel_hangar.png";
    link.click();
}

function DownloadImageButton({canvas}) {
    return (
        <button onClick={() => onButtonClick(canvas)}></button>
    );
}

export default DownloadImageButton;