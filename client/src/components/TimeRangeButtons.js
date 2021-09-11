import React from "react";
import { StyledTimeRangeButtons } from "../styles";
const TimeRangeButtons = ({ activeRange, setActiveRange }) => {
  return (
    <StyledTimeRangeButtons>
      <li>
        <button
          className={activeRange === "short" ? "active" : ""}
          onClick={() => setActiveRange("short")}>
          This Month
        </button>
      </li>
      <li>
        <button
          className={activeRange === "medium" ? "active" : ""}
          onClick={() => setActiveRange("medium")}>
          Last 6 Month
        </button>
      </li>
      <li>
        <button
          className={activeRange === "long" ? "active" : ""}
          onClick={() => setActiveRange("long")}>
          All Time
        </button>
      </li>
    </StyledTimeRangeButtons>
  );
};
export default TimeRangeButtons;
