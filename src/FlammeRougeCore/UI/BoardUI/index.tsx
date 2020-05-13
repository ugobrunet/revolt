import React, { useState, useEffect, useRef } from "react";
import {
  Board,
  MapStep,
  MapSpot,
  Move,
  Action,
  PlayerDictionnary,
} from "../../Board";
import { HeartBeat, Shoot } from "../../Deck";
import intl from "react-intl-universal";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import FavoriteIcon from "@material-ui/icons/Favorite";
import _ from "lodash";
import TargetIcon from "./BoardContentUI/target";
import ShotsUI from "../ShotsUI";
import { handleAction } from "../ActionHandler";
import BoardContentUI from "./BoardContentUI";

const BORDER_WIDTH = 5;
const emptyFunction = () => {};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      padding: "20px 0px",
    },
    default: {
      border: `${BORDER_WIDTH}px solid lightgray`,
    },
    start: {
      border: `${BORDER_WIDTH}px dashed GreenYellow`,
    },
    end: {
      border: `${BORDER_WIDTH}px solid lightgray`,
      backgroundColor: "white",
      backgroundImage:
        "linear-gradient(45deg, lightgray 25%, transparent 25%, transparent 75%, lightgray 75%), linear-gradient(45deg, lightgray 25%, transparent 25%, transparent 75%, lightgray 75%)",
      backgroundPosition: "0 0, 5px 5px",
      backgroundSize: "10px 10px",
    },
    up: {
      border: `${BORDER_WIDTH}px solid red`,
    },
    down: {
      border: `${BORDER_WIDTH}px solid cyan`,
    },
    shoot: {
      border: `${BORDER_WIDTH}px solid gray`,
    },
    lap: {
      border: `${BORDER_WIDTH}px solid LemonChiffon`,
    },
    paper_current: {
      fontWeight: "bold",
      color: "black !important",
    },
    paper: {
      textAlign: "center",
      color: theme.palette.text.secondary,
      height: "40px",
      width: "40px",
      lineHeight: "30px",
      padding: "0px",
      fontSize: "18px",
      position: "relative",
      // fontWeight: "bold"
    },
    paper_selected: {
      backgroundColor: "yellow",
    },
    icon: {
      color: "red",
      height: "30px",
    },
    heartBeat_icon: {
      height: "30px",
      width: "30px",
      position: "absolute",
      top: "-15px",
      right: "-15px",
    },
    heartBeat_text: {
      position: "absolute",
      top: "-17px",
      right: "-15px",
      fontSize: "12px",
      textAlign: "center",
      width: "30px",
      height: "30px",
      color: "white",
    },
    target_icon: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "30px",
      height: "30px",
    },
  })
);

const HEARTBEAT_COLORS = [
  "#2E7F18",
  "#45731E",
  "#675E24",
  "#8D472B",
  "#B13433",
  "#C82538",
];

const BoardUI = ({
  board,
  playerID,
  heartBeats,
  selectedRunner,
  animationStarted,
  animationEnded,
  displayMessage,
  playersNames,
  actionIndexChanged,
}: {
  board: Board;
  playerID: number;
  heartBeats: (HeartBeat | null)[];
  selectedRunner: number | null;
  animationStarted: () => void;
  animationEnded: () => void;
  displayMessage: (message: string | null) => void;
  playersNames: PlayerDictionnary<string>;
  actionIndexChanged: (index: number) => void;
}) => {
  const [actionIndex, setActionIndex] = useState(0);
  const actionIndexRef = useRef(actionIndex);
  actionIndexRef.current = actionIndex;
  const [shots, setShots] = useState<Shoot[] | null>(null);
  const shotsRef = useRef(shots);
  shotsRef.current = shots;
  const [stateBoard, setStateBoard] = useState(new Board());
  const stateBoardRef = useRef(stateBoard);
  stateBoardRef.current = stateBoard;
  const [shootVelocity, setShootVelocity] = useState(0);
  const [shootingTitle, setShootingTitle] = useState<string>("");
  const [animating, setAnimating] = useState(false);
  const [fatigue, setFatigue] = useState<Move[]>([]);

  let timer: ReturnType<typeof setTimeout> | null = null;
  let interval: ReturnType<typeof setInterval> | null = null;
  let closingTimer: ReturnType<typeof setTimeout> | null = null;

  console.log("Interval:", interval);

  useEffect(() => {
    const actionCount = board.actions.length;
    if (actionIndex === 0) {
      setActionIndex(actionCount);
    } else {
      if (interval === null) {
        interval = setInterval(nextActionFromRef, 2000);
        nextAction();
      }
    }
    setStateBoard(board);
  }, [board.actions.length]);

  useEffect(() => {
    if (interval !== null) {
      clearInterval(interval);
      interval = setInterval(nextActionFromRef, 2000);
      nextAction();
    }
  }, [shots]);

  useEffect(() => {
    actionIndexChanged(actionIndex);
    console.log("State Action Index changed:", new Date());
    if (actionIndex !== 0) {
      const hasNextAction = actionIndex !== board.actions.length;

      if (closingTimer !== null) {
        clearTimeout(closingTimer);
        closingTimer = null;
      }

      if (!hasNextAction) {
        closingTimer = setTimeout(() => {
          setAnimationStatus(false, animationStarted, animationEnded);
          handleAction(
            null,
            displayMessage,
            playersNames,
            setFatigue,
            setShots,
            setShootVelocity,
            setShootingTitle
          );
        }, 2000);
      }
    }
  }, [actionIndex]);

  const nextActionFromRef = () => nextAction(true);

  const nextAction = (useStateVariable?: boolean) => {
    const boardRef = useStateVariable ? stateBoardRef.current : board;
    const isShooting = (useStateVariable ? shotsRef.current : shots) !== null;
    const hasNextAction =
      (useStateVariable ? actionIndexRef.current : actionIndex) <
      boardRef.actions.length;

    if (!isShooting) {
      if (hasNextAction) {
        const nextActionIndex = actionIndexRef.current + 1;
        setActionIndex(nextActionIndex);
        setAnimationStatus(true, animationStarted, animationEnded);
        const action = boardRef.actions[nextActionIndex - 1];
        handleAction(
          action,
          displayMessage,
          playersNames,
          setFatigue,
          setShots,
          setShootVelocity,
          setShootingTitle
        );
      } else {
        if (interval !== null) {
          clearInterval(interval);
          interval = null;
        }
      }
    }
  };

  const handleShotDone = () => {
    setShots(null);
  };

  const setAnimationStatus = (
    running: boolean,
    animationStarted: () => void,
    animationEnded: () => void
  ) => {
    animationStarted = animationStarted || emptyFunction;
    animationEnded = animationEnded || emptyFunction;

    setAnimating(running);

    if (running) {
      animationStarted();
    } else {
      animationEnded();
    }
  };

  return (
    <div>
      <BoardContentUI
        actionIndex={actionIndex}
        animating={animating}
        board={board}
        fatigues={fatigue}
        heartBeats={heartBeats}
        playerID={playerID}
        selectedRunner={selectedRunner}
      />
      {shots && (
        <ShotsUI
          title={shootingTitle}
          openning={true}
          shots={shots}
          velocity={shootVelocity}
          onClose={handleShotDone}
        />
      )}
    </div>
  );
};

export default BoardUI;
