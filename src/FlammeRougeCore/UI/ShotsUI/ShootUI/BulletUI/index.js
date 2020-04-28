import React from "react";

export default function BulletUI({ classes, top, left }) {
  return (
    <div className={classes.bullet_container} style={{ top: top, left: left }}>
      <div className={classes.bullet}></div>
    </div>
  );
}
