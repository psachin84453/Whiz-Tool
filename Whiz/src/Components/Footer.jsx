import React from "react";
import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/css/bootstrap/tabulator_bootstrap.min.css";

function Footer({ misalignedSuggestions }) {
  console.log("Alignment Suggestions:", misalignedSuggestions);

  const columns = [
    { title: "Direction", field: "position" }, // Display "position" in "Direction" column
    { title: "Suggestions", field: "message" }, // Display "message" in "Suggestions" column
  ];

  return (
    <div className="alignment-suggestions-table">
      <ReactTabulator
        data={misalignedSuggestions}
        columns={columns}
        tooltips={true}
        layout="fitData"
        responsiveLayout="hide"
        height="300px"
      />
    </div>
  );
}

export default Footer;
