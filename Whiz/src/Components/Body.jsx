import React, { useState, useEffect, useRef } from "react";
import VisualCanvas from "./VisualCanvas";
import HiddenVisualCount from "./HiddenVisual";
// import axios from "axios";
import Footer from "./Footer";
import "./Styles.css";

let cnt = 0;
let hiddenVisual = 0;
let misalignedSuggestions = [];

function createVisuals(canvas, visualContainers, clickedVisualIndex, highlightedIndex, threshold1, threshold2, setMisalignedSuggestions) {
  setMisalignedSuggestions([]);
  const ctx = canvas.getContext("2d");
  misalignedSuggestions = [];
  // Clear the canvas before drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let temp = 0;
  hiddenVisual = 0;
  // Loop through each visual container and draw it on the canvas
  visualContainers.forEach((container, index) => {
    const { x, y, width, height } = container;
    const config = JSON.parse(container.config);

    if (config.singleVisual && config.singleVisual.display && config.singleVisual.display.mode === "hidden") {
      hiddenVisual++;
      temp++;

      return; // Skip hidden visuals
    }

    // Determine the text color
    const numberTextColor = index === clickedVisualIndex || index === highlightedIndex ? "green" : "black";

    // Display the number text
    ctx.fillStyle = numberTextColor;
    ctx.font = "14px Arial bold";
    ctx.fillText((index - temp + 1).toString(), x + width / 2, y + height / 2);

    ctx.beginPath();
    ctx.rect(x, y, width, height);

    if (((x >= 0 && x < Number(threshold2)) || canvas.width - (x + width) < Number(threshold2)) && clickedVisualIndex == null) {
      // Apply error styles
      ctx.setLineDash([5, 5]); // Dotted line
      ctx.strokeStyle = "red";
      ctx.font = "14px Arial bold";
      ctx.fillStyle = "red";
      ctx.fillText((index - temp + 1).toString(), x + width / 2, y + height / 2);
    } else if (index === clickedVisualIndex || index === highlightedIndex) {
      // Apply highlighting styles
      ctx.setLineDash([5, 5]); // Dotted line
      ctx.strokeStyle = "green";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.moveTo(x + width, 0);
      ctx.lineTo(x + width, canvas.height);
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.moveTo(0, y + height);
      ctx.lineTo(canvas.width, y + height);
      ctx.stroke();
    } else if (!isAligned(container, visualContainers[clickedVisualIndex], index - temp, threshold1, setMisalignedSuggestions) && clickedVisualIndex !== null) {
      // Apply error styles
      ctx.setLineDash([]); // Reset line dash

      ctx.strokeStyle = "red";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillStyle = "red";
      ctx.font = "14px Arial bold";
      ctx.fillText((index - temp + 1).toString(), x + width / 2, y + height / 2);
    } else {
      // Apply default styles
      ctx.setLineDash([]); // Reset line dash
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    ctx.stroke();
  });
  return hiddenVisual;
}

function clearDiv() {
  const leftDiv = document.getElementById("left");
  const topDiv = document.getElementById("top");
  const rightDiv = document.getElementById("right");
  const bottomDiv = document.getElementById("bottom");

  if (leftDiv) {
    leftDiv.replaceChildren();
  }

  if (topDiv) {
    topDiv.replaceChildren();
  }

  if (rightDiv) {
    rightDiv.replaceChildren();
  }

  if (bottomDiv) {
    bottomDiv.replaceChildren();
  }
}

function isAligned(rect1, rect2, i, threshold1, setMisalignedSuggestions) {
  if (!rect1 || !rect2) {
    return [];
  }

  const x_dist = Math.abs(rect1.x - rect2.x);
  const y_dist = Math.abs(rect1.y - rect2.y);
  const x_right_dist = Math.abs(rect1.x + rect1.width - (rect2.x + rect2.width));
  const y_bottom_dist = Math.abs(rect1.y + rect1.height - (rect2.y + rect2.height));

  const threshold = Number(threshold1);

  if (x_dist.toFixed(1) <= threshold && x_dist.toFixed(1) != 0) {
    setMisalignedSuggestions((prevSuggestions) => [
      ...prevSuggestions,
      {
        position: "Left",
        message: "Visual " + (i + 1) + " is misaligned with selected visual by " + x_dist.toFixed(1) + " px"
      }
    ]);
    return false;
  }

  if (y_dist.toFixed(1) <= threshold && y_dist.toFixed(1) != 0) {
    setMisalignedSuggestions((prevSuggestions) => [
      ...prevSuggestions,
      {
        position: "Top",
        message: "Visual " + (i + 1) + " is misaligned with selected visual by " + y_dist.toFixed(1) + " px"
      }
    ]);
    return false;
  }

  if (x_right_dist.toFixed(1) <= threshold && x_right_dist.toFixed(1) != 0) {
    setMisalignedSuggestions((prevSuggestions) => [
      ...prevSuggestions,
      {
        position: "Right",
        message: "Visual " + (i + 1) + " is misaligned with selected visual by " + x_right_dist.toFixed(1) + " px"
      }
    ]);
    return false;
  }

  if (y_bottom_dist.toFixed(1) <= threshold && y_bottom_dist.toFixed(1) != 0) {
    setMisalignedSuggestions((prevSuggestions) => [
      ...prevSuggestions,
      {
        position: "Bottom",
        message: "Visual " + (i + 1) + " is misaligned with selected visual by " + y_bottom_dist.toFixed(1) + " px"
      }
    ]);
    return false;
  }

  return misalignedSuggestions;
}

function Body({ threshold1, threshold2, isVisualSelected, setIsVisualSelected }) {
  // Receive setIsVisualSelected as a prop

  // hooks

  const [visualContainers, setVisualContainers] = useState([]);

  // const [canvas, setCanvas] = useState(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [clickedVisualIndex, setClickedVisualIndex] = useState(null);
  const [hiddenVisual, setHiddenVisual] = useState(0); // Initialize hiddenVisual state
  const [misalignedSuggestions, setMisalignedSuggestions] = useState([]);

  const canvasRef = useRef(null);

  const currentVisualContainers = 0;

  useEffect(() => {
    // Simulate fetching data for visualContainers
    import('./layout.json')
      .then(data => {
        if (data.sections && data.sections.length > 0) {
          setVisualContainers(data.sections);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // useEffect(() => {
  //   // Fetch current theme data
  //   axios
  //     .get("/alignment/layout")
  //     .then((res) => {
  //       let layoutData = res.data;
  //       if (layoutData.error) {
  //         console.error("Error fetching theme data:", error);
  //       }
  //       layoutData = layoutData.fileContent;
  //       layoutData = JSON.parse(layoutData);

  //       if (layoutData.sections && layoutData.sections.length > 0) {
  //         setVisualContainers(layoutData.sections);
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle any errors here
  //       console.error("Error fetching theme data:", error);
  //     });
  // }, []);
  useEffect(() => {
    if (visualContainers.length > 0 && currentPageIndex < visualContainers.length) {
      const currentVisualContainers = visualContainers[currentPageIndex]?.visualContainers;
      if (threshold2 !== undefined) {
        const hiddenVisualCount = createVisuals(canvasRef.current, currentVisualContainers, clickedVisualIndex, highlightedIndex, threshold1, threshold2, setMisalignedSuggestions);
        setHiddenVisual(hiddenVisualCount);
      }
    }
  }, [currentPageIndex, visualContainers, clickedVisualIndex, highlightedIndex, threshold1, threshold2]);

  // Inside Body component
  function handleCanvasClick(e) {
    const canvas = canvasRef.current;
    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - canvasRect.left;
    const canvasY = e.clientY - canvasRect.top;

    const currentVisualContainers = visualContainers[currentPageIndex]?.visualContainers;

    let newClickedVisualIndex = null;

    for (let i = 0; i < currentVisualContainers.length; i++) {
      const container = currentVisualContainers[i];
      const config = JSON.parse(container.config);

      if (canvasX >= container.x && canvasX <= container.x + container.width && canvasY >= container.y && canvasY <= container.y + container.height) {
        if (config.singleVisual && config.singleVisual.display && config.singleVisual.display.mode === "hidden") {
          continue; // Skip hidden visuals
        }

        if (
          newClickedVisualIndex === null ||
          container.width * container.height < currentVisualContainers[newClickedVisualIndex].width * currentVisualContainers[newClickedVisualIndex].height
        ) {
          newClickedVisualIndex = i;
        }
      }
    }

    // Update the clicked visual index and highlighted index
    setClickedVisualIndex(newClickedVisualIndex);
    setHighlightedIndex(newClickedVisualIndex);

    setIsVisualSelected(newClickedVisualIndex !== null);

    if (newClickedVisualIndex !== clickedVisualIndex) {
      clearDiv();
    }
    if (clickedVisualIndex !== null) {
      isAligned(currentVisualContainers[newClickedVisualIndex], visualContainers[clickedVisualIndex].visualContainers[i], i, threshold1, setMisalignedSuggestions);
    }
  }
  return (
    <div className="Body">
  <div className="allPageInARow margin-bottom-20px" style={{ width: "100%" }}>
    {visualContainers.map((page, index) => (
      <div
        className={`${currentPageIndex === index ? "selectedPage" : ""} whizButton2`}
        key={index}
        onClick={() => {
          setCurrentPageIndex(index);
          setClickedVisualIndex(null);
          setHighlightedIndex(null);
          setIsVisualSelected(false);
        }}
      >
        {page.displayName}
      </div>
    ))}
  </div>
  <HiddenVisualCount count={hiddenVisual} /> {/* Display the count component */}
  <div className="canvas-container" style={{ display: "flex" }}>
    <div style={{ flex: 1 }}>
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width={visualContainers[currentPageIndex]?.width}
        height={visualContainers[currentPageIndex]?.height}
        onClick={handleCanvasClick}
      ></canvas>
    </div>
    <div style={{ flex: 1 }}>
      {clickedVisualIndex == null && (
        <div className="visual-canvas-content" style={{ marginLeft: "20px" }}>
          <VisualCanvas threshold1={threshold1} isVisualSelected={false} visualContainers={visualContainers[currentPageIndex]?.visualContainers} />
        </div>
      )}
    </div>
    <div style={{ marginLeft: "20px" }}>{isVisualSelected && <Footer misalignedSuggestions={misalignedSuggestions} />}</div>
  </div>
</div>

  );
}
export default Body;
