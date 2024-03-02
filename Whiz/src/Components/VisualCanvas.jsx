import React, { useEffect, useState } from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css"; // Required styles
import "react-tabulator/lib/css/tabulator.min.css"; // Theme

function VisualCanvas({ threshold1, visualContainers }) {
  const [misalignedPairs, setMisalignedPairs] = useState([]);

  useEffect(() => {
    if (!visualContainers || !Array.isArray(visualContainers)) {
      // Handle the case when visualContainers is undefined or not an array
      return;
    }

    const alignmentSuggestions = [];
    let temp1 = 0;
    // let temp2 = 0;

    for (let i = 0; i < visualContainers.length; i++) {
      const container1 = visualContainers[i];
      const config1 = JSON.parse(container1.config);

      if (!config1.singleVisual || !config1.singleVisual.display || config1.singleVisual.display.mode !== "hidden") {
        let temp2 = 0;
        for (let j = 0; j < visualContainers.length; j++) {
          if (i !== j) {
            // Avoid comparing the same container
            const container2 = visualContainers[j];
            const config2 = JSON.parse(container2.config);

            if (!config2.singleVisual || !config2.singleVisual.display || config2.singleVisual.display.mode !== "hidden") {
              if (!isAligned(container1, container2, i, threshold1)) {
                alignmentSuggestions.push({ visual1: i + 1 - temp1, visual2: j + 1 - temp2 });
              }
            } else {
              temp2++;
            }
          }
        }
      } else {
        temp1++;
      }
    }

    setMisalignedPairs(alignmentSuggestions);
  }, [visualContainers, threshold1]);

  function isAligned(rect1, rect2, i, threshold1) {
    if (!rect1 || !rect2) {
      return true; // Treat as aligned if either rect1 or rect2 is missing
    }

    const x_dist = Math.abs(rect1.x - rect2.x);
    const y_dist = Math.abs(rect1.y - rect2.y);
    const x_right_dist = Math.abs(rect1.x + rect1.width - (rect2.x + rect2.width));
    const y_bottom_dist = Math.abs(rect1.y + rect1.height - (rect2.y + rect2.height));
    const threshold = Number(threshold1);

    if (x_dist.toFixed(1) <= threshold && x_dist.toFixed(1) !== "0.0") {
      return false;
    }

    if (y_dist.toFixed(1) <= threshold && y_dist.toFixed(1) !== "0.0") {
      return false;
    }

    if (x_right_dist.toFixed(1) <= threshold && x_right_dist.toFixed(1) !== "0.0") {
      return false;
    }

    if (y_bottom_dist.toFixed(1) <= threshold && y_bottom_dist.toFixed(1) !== "0.0") {
      return false;
    }

    return true; // Treat as aligned if none of the conditions match
  }

  // Create an array to store visuals with alignment suggestions
  const visualsWithSuggestions = visualContainers?.filter((container, index) => {
    return misalignedPairs.some((pair) => pair.visual1 === index + 1);
  });
  return (
    <div>
      <h2 className="reportUIAlignmentPageTitle">Misaligned Visual Pairs:</h2>
      {visualContainers && Array.isArray(visualContainers) && misalignedPairs && Array.isArray(misalignedPairs) ? (
        <ReactTabulator
          data={visualsWithSuggestions.map((container, index) => {
            const notAlignedWith = misalignedPairs.filter((pair) => pair.visual1 === index + 1).map((pair) => pair.visual2);
            return {
              Visual: index + 1,
              "Not Aligned With These": notAlignedWith.join(", ")
            };
          })}
          columns={[
            { title: "Visual", field: "Visual", width: 80 },
            { title: "Misaligned visuals", field: "Not Aligned With These", maxWidth: 300 }
          ]}
          options={{
            layout: "fitColumns"
          }}
        />
      ) : (
        <p>No visual containers or misaligned pairs available.</p>
      )}
    </div>
  );
}

export default VisualCanvas;
