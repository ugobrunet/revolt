import React, { useState, useEffect, useRef } from "react";

import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ShootUI from "./ShootUI";
import { Shoot } from "../../Deck";

const ShotsUI = ({
  openning,
  title,
  shots,
  velocity,
  onClose,
}: {
  openning: boolean;
  title: string;
  shots: Shoot[];
  velocity: number;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [hided, setHided] = useState<boolean[]>([]);
  const hidedRef = useRef(hided);
  hidedRef.current = hided;
  let timer: ReturnType<typeof setTimeout> | null = null;

  useEffect(() => {
    if (timer === null) {
      handleOpen(velocity, onClose);
    }
  }, [openning]);

  const triggerShot = (velocity: number, onClose: () => void) => {
    let delay = 2000;
    if (velocity < 0) {
      delay = 3000;
    }
    if (velocity > 0) {
      delay = 1000;
    }

    if (hidedRef.current.length < 5) {
      if (hidedRef.current.length === 4) delay = 2000;
      setHided(hidedRef.current.concat([true]));
      timer = setTimeout(() => {
        triggerShot(velocity, onClose);
      }, delay);
    } else {
      handleClose(onClose);
    }
  };

  const handleOpen = (velocity: number, onClose: () => void) => {
    setOpen(true);
    setHided([]);
    timer = setTimeout(() => {
      triggerShot(velocity, onClose);
    }, 2000);
  };

  const handleClose = (onClose: () => void) => {
    setOpen(false);
    onClose();
  };

  const renderShot = (shot: Shoot, key: number, hided: boolean) => {
    return (
      <Grid item xs={6} sm={2} key={key}>
        <ShootUI
          success={shot.success}
          randomR={shot.radius}
          randomA={shot.angle}
          active={hided}
        />
      </Grid>
    );
  };

  return (
    <Dialog open={open} fullWidth onClose={handleClose}>
      {openning && <DialogTitle>{title}</DialogTitle>}
      {openning && (
        <DialogContent>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            spacing={1}
          >
            {shots.map((e, i) =>
              renderShot(e, i, i < hided.length ? hided[i] : false)
            )}
          </Grid>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default ShotsUI;
