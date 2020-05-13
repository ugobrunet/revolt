import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import Gauge from "./SVG/gauge";

import NullCardUI from "./NullCardUI";
import Border from "./SVG/border";
import { Card } from "../../Card";
import svgs from "../icons/svgs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: "relative",
      maxWidth: "170px",
      width: "100%",
      margin: "auto",
    },
    gaugeContainer: {
      position: "absolute",
      top: "3%",
      left: "5%",
      right: "5%",
      bottom: "3%",
    },
    bikeTimeContainer: {
      position: "absolute",
      width: "100%",
      textAlign: "center",
      top: "20px",
      padding: "0 10%",
    },
    bikeTime: {
      fontSize: "1.5rem",
      lineHeight: "1.5rem",
      fontWeight: 450,
    },
    bikeTimeAnd: {
      fontSize: "0.875rem",
      fontWeight: 450,
    },
    bikeTimeExt: {
      fontSize: "1.125rem",
      fontWeight: 450,
    },
    bike: {
      fontSize: "1.3rem",
      lineHeight: "1.3rem",
      fontWeight: 300,
    },
    titleContainer: {
      position: "absolute",
      width: "100%",
      textAlign: "center",
      bottom: "10px",
      padding: "0 10%",
    },
    detail: {
      fontSize: "0.875rem",
      lineHeight: "0.875rem",
      fontWeight: 300,
    },
    title: {
      fontSize: "1rem",
      lineHeight: "1rem",
      fontWeight: 450,
    },
    energy: {
      fontSize: "0.875rem",
      lineHeight: "0.875rem",
      fontWeight: 300,
      fontStyle: "italic",
    },
    icon: {
      position: "absolute",
      top: "40%",
      width: "40%",
      left: "30%",
      fill: "black",
    },
    titleHidedContainer: {
      position: "absolute",
      width: "100%",
      textAlign: "center",
      bottom: "20px",
      padding: "0 10%",
    },
    titleHided: {
      fontSize: "1rem",
      lineHeight: "1rem",
      fontWeight: 450,
    },
    titleDetailHided: {
      fontSize: "0.875rem",
      lineHeight: "0.875rem",
      fontWeight: 300,
      fontStyle: "italic",
    },
    iconHided: {
      position: "absolute",
      top: "17%",
      width: "74%",
      left: "13%",
      fill: "black",
    },
  })
);

const renderBikeTime = (bikeTime: string, classes: any) => {
  const indexOfAnd = bikeTime.indexOf(" et ");
  const containsAnd = indexOfAnd > -1;
  const bikeTimeMain = containsAnd ? bikeTime.substr(0, indexOfAnd) : bikeTime;
  const bikeTimeExt = containsAnd ? bikeTime.substr(indexOfAnd + 4) : null;

  return (
    <div>
      <span className={classes.bikeTime}>{bikeTimeMain}</span>
      {containsAnd && " "}
      {containsAnd && <span className={classes.bikeTimeAnd}>et</span>}
      {containsAnd && <br />}
      {containsAnd && (
        <span className={classes.bikeTimeExt}>{bikeTimeExt}</span>
      )}
    </div>
  );
};

const CardUI = ({
  card,
  hided,
  onClick,
}: {
  card: Card | null;
  hided: boolean;
  onClick?: () => void;
}) => {
  const classes = useStyles();

  if (!card) return <NullCardUI onClick={onClick} />;

  const Icon = svgs.get(card.id);

  return (
    <div className={classes.container}>
      <Border />
      {!hided && (
        <div className={classes.gaugeContainer}>
          <Gauge value={card.gauge}></Gauge>
        </div>
      )}
      {!hided && (
        <div className={classes.bikeTimeContainer}>
          {renderBikeTime(card.bikeTime, classes)}
          <Typography variant="body2" gutterBottom className={classes.bike}>
            de VÉLO
          </Typography>
        </div>
      )}
      {!hided && (
        <div className={classes.titleContainer}>
          <Typography variant="body2" gutterBottom className={classes.detail}>
            {card.titleDetail}
          </Typography>
          <Typography variant="body1" gutterBottom className={classes.title}>
            {card.title}
          </Typography>
          <Typography variant="body2" gutterBottom className={classes.energy}>
            {card.energy + " Watt.h"}
          </Typography>
        </div>
      )}
      {Icon !== undefined && (
        <Icon className={hided ? classes.iconHided : classes.icon} />
      )}

      {hided && (
        <div className={classes.titleHidedContainer}>
          <Typography
            variant="body1"
            gutterBottom
            className={classes.titleHided}
          >
            {card.title}
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            className={classes.titleDetailHided}
          >
            {card.titleDetailHided}
          </Typography>
        </div>
      )}
    </div>
  );
};
export default CardUI;
