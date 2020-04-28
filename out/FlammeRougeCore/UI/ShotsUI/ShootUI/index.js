import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BulletUI from "./BulletUI";
import "./style.css";
var TARGET_RADIUS = 35;
var useStyles = makeStyles(function (theme) { return ({
    button_container: {
        textAlign: "center"
    },
    button_item: {
        margin: "5px"
    },
    target_container: {
        paddingTop: "100%",
        width: "100%",
        position: "relative"
    },
    target_backgroud: {
        position: "absolute",
        top: 50 - TARGET_RADIUS + "%",
        left: 50 - TARGET_RADIUS + "%",
        bottom: 50 - TARGET_RADIUS + "%",
        right: 50 - TARGET_RADIUS + "%",
        backgroundColor: "#202020",
        borderRadius: "50%",
        overflow: "hidden"
    },
    target_missed: {
        position: "relative",
        width: "100%",
        height: "100%",
        opacity: "0",
        backgroundColor: "red",
        WebkitAnimation: "flashError linear 1s 1",
        WebkitAnimationDelay: "0.2s",
        animation: "flashError linear 1s 1",
        animationDelay: "0.2s",
        zIndex: "1"
    },
    cache: {
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: "50%",
        border: "1px solid",
        zIndex: "1"
    },
    cache_not_active: {
        top: "100%"
    },
    cache_active: {
        top: "0%",
        transformOrigin: "bottom",
        WebkitAnimationName: "bounce-7",
        WebkitAnimationTimingFunction: "cubic-bezier(0.28, 0.84, 0.42, 1)",
        WebkitAnimationDuration: "1s",
        animationName: "bounce-7",
        animationTimingFunction: "cubic-bezier(0.28, 0.84, 0.42, 1)",
        animationDuration: "1s"
    },
    bullet_container: {
        position: "absolute"
    },
    bullet: {
        position: "absolute",
        top: "-5px",
        left: "-5px",
        width: "10px",
        height: "10px",
        backgroundColor: "darkgray",
        borderRadius: "50%"
    }
}); });
var renderButton = function (text, key, handleClick, classes) {
    return (<Button className={classes.button_item} onClick={function () { return handleClick(); }} key={key} variant="contained">
      {text}
    </Button>);
};
export default function ShootUI(_a) {
    var success = _a.success, randomR = _a.randomR, randomA = _a.randomA, active = _a.active;
    var classes = useStyles();
    var R = !success
        ? (randomR * (50 - TARGET_RADIUS)) / 100 + TARGET_RADIUS
        : (randomR * TARGET_RADIUS) / 100;
    var ANGLE = (randomA * 360) / 100;
    var top = Math.round(50 + R * Math.sin(ANGLE)) + "%";
    var left = Math.round(50 + R * Math.cos(ANGLE)) + "%";
    var cache_active = classes.cache +
        " " +
        (active && success ? classes.cache_active : classes.cache_not_active);
    return (<div className={classes.target_container}>
      <div className={classes.target_backgroud}>
        {active && !success && <div className={classes.target_missed}></div>}
        <div className={cache_active}></div>
      </div>
      {active && <BulletUI classes={classes} top={top} left={left}/>}

      
    </div>);
}
//# sourceMappingURL=index.js.map