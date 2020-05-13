import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const OFFSET = 26;
const DIFF = 340;
const WHOLE = DIFF + OFFSET;

const useStyles = makeStyles((theme) =>
  createStyles({
    svg: {
      position: "absolute",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      fill: "transparent",
    },
  })
);

const getColor = (value) => {
  //value from 0 to 100
  var hue = (((100 - value) / 100) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
};

const Gauge = (props) => {
  const classes = useStyles();
  const value = props.value;
  const color = props.color ? props.color : getColor(value);
  const ratio = Math.max(0, Math.min(WHOLE, Math.floor((WHOLE * value) / 100)));
  const strokeDashAray =
    ratio > DIFF
      ? ratio - DIFF + "% " + (WHOLE - ratio) + "% " + DIFF + "% 400%"
      : "0% " + OFFSET + "% " + ratio + "% 400%";
  return (
    <svg
      className={classes.svg}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5%"
        y="1%"
        rx="12%"
        ry="8%"
        width="97%"
        height="98%"
        strokeWidth="2%"
        stroke={`${color}`}
        strokeDasharray={`${strokeDashAray}`} //"13% 13% 337% 400%"
      />
    </svg>
  );
};

export default Gauge;
