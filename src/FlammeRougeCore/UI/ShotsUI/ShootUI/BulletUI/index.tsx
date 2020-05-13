import React from "react";

const BulletUI = ({
  classes,
  top,
  left,
}: {
  classes: any;
  top: string;
  left: string;
}) => {
  return (
    <div className={classes.bullet_container} style={{ top: top, left: left }}>
      <div className={classes.bullet}></div>
    </div>
  );
};

export default BulletUI;
