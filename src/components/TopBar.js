import React, { useRef } from "react";

function TopBar({ clearHangar, handleImageSave, handleImageUpload, onToggleOverlay, benniesHenge, setBenniesHenge, cargo, setCargo, people, setPeople }) {
    const fileInputRef = useRef(null);

    const handleOpenFileViewer = () => {
        fileInputRef.current.click();
    };

    const toggleableOverlays = [
        {state: benniesHenge, key: "Bennies Henge"},
        {state: cargo, key: "Cargo"},
        {state: people, key: "People"},
    ];

    const handleToggle = (option) => {
        if (option === "Bennies Henge") {
            const newState = !benniesHenge;
            setBenniesHenge(newState);
            onToggleOverlay("Bennies Henge", newState);
        }
        else if (option === "Cargo") {
            const newState = !cargo;
            setCargo(newState);
            onToggleOverlay("Cargo", newState);
        }
        else if (option === "People") {
            const newState = !people;
            setPeople(newState);
            onToggleOverlay("People", newState);
        }

    };

    return (
        <div className="TopBar">
            <div style={{ display: "flex", flexDirection: "column" }}>
                <button onClick={handleImageSave}>Save Pixel Hangar As...</button>
                <button onClick={clearHangar}>Clear Pixel Hangar</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <button onClick={handleOpenFileViewer}>Upload Image...</button>
                <input
                    type="file"
                    accept = ".png"
                    ref={fileInputRef}
                    style={{display: "none"}}
                    onChange={handleImageUpload}
                />
                <button onClick={() => { localStorage.setItem("hangarState", "[]") }}>Clear Hangar Cache</button>
            </div>
            {toggleableOverlays.map(({state, key}, index) => {
                return (
                    <label style={{ color: "white" }} key={index}>
                        <input
                            type="checkbox"
                            checked={state}
                            onChange={() => handleToggle(key)}
                        >
                        </input>
                        {key}
                </label>
                );
            })}
        </div>
    );
}

export default TopBar;