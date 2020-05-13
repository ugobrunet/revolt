import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Border from "../SVG/border";
import { ReactComponent as AddIcon } from "../../icons/add.svg";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: "relative",
      maxWidth: "170px",
      width: "100%",
      margin: "auto",
    },
    icon: {
      position: "absolute",
      top: "37%",
      width: "40%",
      left: "30%",
      fill: "darkgray",
    },
  })
);

const NullCardUI = ({ onClick }: { onClick?: () => void }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Button
        className={classes.container}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        <Border dashed={true} />
        <AddIcon className={classes.icon} />
      </Button>
    </div>
  );
};
export default NullCardUI;
