import React from "react";

function HiddenVisual({ count }) {
  return (
    count > 0 && (
      <div>
        <h4 className="reportUIAlignmentPageTitle">Number of Hidden Visuals: {count}</h4>
      </div>
    )
  );
}

export default HiddenVisual;
