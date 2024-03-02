import React, { useState, useEffect } from "react";
import "./Components/Styles.css";
import Body from "./Components/Body";

function App() {
  const [visualContainers, setVisualContainers] = useState([]);
  const [details, setDetails] = useState({
    threshold1: 10,
    threshold2: 10
  });
  const [activeInput, setActiveInput] = useState(null);
  const [isVisualSelected, setIsVisualSelected] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInputClick = (name) => {
    setActiveInput(name);
  };

  const handleReset = () => {
    setDetails({
      threshold1: 10,
      threshold2: 10
    });
    setActiveInput(null);
  };

  return (
    <div>
      <form id="alignmentPageFilterForm" style={{ display: "flex" }}>
        <h6>
          Margin for misaligned visual identification{" "}
          <input
            type="number"
            name="threshold1"
            value={details.threshold1}
            onChange={handleChange}
            onClick={() => handleInputClick("threshold1")}
            disabled={activeInput === "threshold2" || isVisualSelected}
          />
        </h6>
        <h6>
          Minimum margins (Left & Right){" "}
          <input
            type="number"
            name="threshold2"
            value={details.threshold2}
            onChange={handleChange}
            onClick={() => handleInputClick("threshold2")}
            disabled={activeInput === "threshold1" || isVisualSelected}
          />
        </h6>
        <button className="whizButton2 resetFilter" type="button" onClick={handleReset}>
          Reset Filters
        </button>
      </form>

      <div style={{ display: "flex" }} id="app-Body">
        <Body
          threshold1={details.threshold1}
          threshold2={details.threshold2}
          isVisualSelected={isVisualSelected}
          setIsVisualSelected={setIsVisualSelected}
          visualContainers={visualContainers}
        />
      </div>
    </div>
  );
}

export default App;
