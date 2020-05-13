import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      width: "100%",
      position: "relative",
      paddingTop: "150%",
    },
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

const Border = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <svg
        className={classes.svg}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="1.5%"
          y="1%"
          rx="15%"
          ry="10%"
          width="97%"
          height="98%"
          strokeWidth="2%"
          stroke="darkgray"
          strokeDasharray={props.dashed ? 20 : null}
        />
      </svg>
    </div>
  );
};

export default Border;
