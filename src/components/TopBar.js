import React from "react";

function TopBar({ clearHangar, handleImageSave, onToggleOverlay, benniesHenge, setBenniesHenge, cargo, setCargo, people, setPeople }) {

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
            <button onClick={handleImageSave}>Save Pixel Hangar As...</button>
            <button onClick={clearHangar}>Clear Pixel Hangar</button>
            <button onClick={() => { localStorage.setItem("hangarState", "[]") }}>Clear Hangar Cache</button>
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