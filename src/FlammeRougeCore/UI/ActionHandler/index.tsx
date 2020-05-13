import intl from "react-intl-universal";
import { Action, Move, PlayerDictionnary } from "../../Board";
import { HeartBeat, Shoot } from "../../Deck";

export const handleAction = (
  action: Action | null,
  displayMessage: (message: string | null) => void,
  playersNames: PlayerDictionnary<string>,
  setFatigue: (value: React.SetStateAction<Move[]>) => void,
  setShots: (value: React.SetStateAction<Shoot[] | null>) => void,
  setShootVelocity: (value: React.SetStateAction<number>) => void,
  setShootingTitle: (value: React.SetStateAction<string>) => void
) => {
  if (!action) {
    displayMessage(null);
    setFatigue([]);
  } else {
    const firstMove = action.moves[0];
    const firstPlayer = firstMove.player;
    const name = playersNames[firstPlayer.playerID];
    const type = intl.get(
      "flamme_rouge." + firstPlayer.type.toString().toLowerCase()
    );
    let message;

    switch (action.name) {
      case "initial":
        message = intl.get("flamme_rouge.doing_initial_position", {
          name: name,
          type: type,
        });
        displayMessage(message);
        break;
      case "played":
        message = intl.get("flamme_rouge.doing_played_card", {
          name: name,
          type: type,
          card: firstMove.metadata.pickedCard,
          distance: firstMove.distance,
        });
        displayMessage(message);
        break;
      case "shooting":
        let shootVelocity = "";
        switch (firstMove.metadata.shootVelocity) {
          case -1:
            shootVelocity = intl.get("flamme_rouge.shooting_slowly");
            break;
          case 0:
            shootVelocity = intl.get("flamme_rouge.shooting_normally");
            break;
          case 1:
            shootVelocity = intl.get("flamme_rouge.shooting_quickly");
            break;
          default:
            break;
        }
        const shootingTitle = intl.get("flamme_rouge.shooting", {
          name: name,
          type: type,
          style: shootVelocity,
        });
        setShots(firstMove.metadata.shots);
        setShootVelocity(firstMove.metadata.shootVelocity);
        setShootingTitle(shootingTitle);
        break;
      case "shot":
        const shotsRatio =
          firstMove.metadata.shots.reduce(
            (a: number, c: Shoot) => a + (c.success ? 1 : 0),
            0
          ) +
          "/" +
          firstMove.metadata.shots.length;
        message = intl.get("flamme_rouge.did_shot", {
          name: name,
          type: type,
          shots: shotsRatio,
        });
        displayMessage(message);
        break;
      case "enterShootingRange":
        message = intl.get("flamme_rouge.enter_shooting_range");
        displayMessage(message);
        break;
      case "finished":
        message = intl.get("flamme_rouge.finished", {
          name: name,
          type: type,
        });
        displayMessage(message);
        break;
      case "suction":
        displayMessage(intl.get("flamme_rouge.doing_suction"));
        break;
      case "fatigue":
        displayMessage(intl.get("flamme_rouge.doing_fatigue"));
        setFatigue(action.moves);
        break;
      default:
        break;
    }
  }
};
