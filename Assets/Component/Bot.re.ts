import * as RE from "rogue-engine";
import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import RapierCollider from "@RE/RogueEngine/rogue-rapier/Components/Colliders/RapierCollider";
export interface BotPosition {
  x: number;
  y: number;
  z: number;
}
export default class Bot extends RE.Component {
  private _rapierBody: RapierBody;
  private _collider: RapierCollider;
  public static botPosition: BotPosition[] = [
    { x: 59.5, y: 1, z: 47.5 },
    { x: 40.5, y: 5, z: -87.0 },
    { x: 45.5, y: 5, z: -46.0 },
    { x: 59.5, y: 1, z: 44.3 },
    { x: 41.5, y: 5, z: -84.0 },
    { x: 46.0, y: 5.2, z: -44.0 },
    { x: 62.8, y: 1.5, z: 44.5 },
    { x: 38.8, y: 5, z: -89.0 },
    { x: 42.0, y: 5.1, z: -44.5 },
    { x: 66.8, y: 1, z: 44.5 },
    { x: 38.8, y: 5, z: -86.0 },
    { x: 40.0, y: 5, z: -44.0 },
    { x: 70.2, y: 1.3, z: 40.9 },
    { x: 35.0, y: 5, z: -84.0 },
    { x: 19.5, y: 5.3, z: -23.0 },

    { x: 27.7, y: 1.2, z: 48.2 },
    { x: 44.0, y: 5, z: -7.7 },
    { x: 65.5, y: 5.2, z: -10.5 },
    { x: 27.9, y: 1.2, z: 44.7 },
    { x: 41.5, y: 5, z: -6.2 },
    { x: 66.3, y: 5.5, z: -9.2 },
    { x: 24.1, y: 1.2, z: 44.3 },
    { x: 41.6, y: 5, z: -10.3 },
     { x: 41.0, y: 5, z: -59.5 },
    { x: 18.5, y: 1.2, z: 41.2 },
    { x: 44.5, y: 5, z: -10.2 }, 
    { x: 43.3, y: 5, z: -58.5 },
    { x: 27.8, y: 1.2, z: 41.2 },
    { x: 42.0, y: 5, z: -12.6 }, 
    { x: 43.0, y: 5.3, z: -62.0 },

    { x: 95.8, y: 1.35, z: 47.8 },
    { x: 45.0, y: 5, z: -43.5 }, 
    { x: 46.5, y: 5.3, z: -27.0 },
    { x: 94.7, y: 1.15, z: 43.4 },
    { x: 42.5, y: 5, z: -42.6 },
    { x: 30.5, y: 5.3, z: -29.0 },
    { x: 96.6, y: 1.2, z: 41.5 },
    { x: 39.5, y: 5, z: -44.3 },
    { x: 95.2, y: 1.1, z: 40.8 },
    { x: 37.5, y: 5, z: -43.1 },
    { x: 97.2, y: 1.17, z: 39.0 },
    { x: 35.8, y: 5, z: -44.5 },

    { x: 85.2, y: 1.17, z: 30.0 },
    { x: 7.2, y: 5, z: -56.2 },
    { x: 87.0, y: 1.1, z: 28.0 },
    { x: 5.3, y: 5.5, z: -60 },
    { x: 87.0, y: 1.1, z: 32.0 },
    { x: 7.0, y: 5.2, z: -61.0 },
    { x: 88.5, y: 1.1, z: 29.0 },
    { x: 5.8, y: 5.8, z: -54.5 },
    { x: 88.5, y: 1.1, z: 31.0 },
    { x: 14.2, y: 5.4, z: -55.8 },

    { x: 65.2, y: 1.2, z: 30.0 },
    { x: 7.0, y: 5.4, z: -50.0 },
    { x: 67.0, y: 1.1, z: 28.0 },
    { x: 5.5, y: 5.35, z: -49.5 },
    { x: 67.0, y: 1.1, z: 32.0 },
    { x: 5.5, y: 5.5, z: -48.5 },
    { x: 68.5, y: 1.1, z: 29.0 },
    { x: 68.5, y: 1.1, z: 31.0 },
  ]
  get rapierBody() {
    if (!this._rapierBody) {
      this._rapierBody = RE.getComponent(
        RapierBody,
        this.object3d
      ) as RapierBody;
    }

    return this._rapierBody;
  }

  awake() {}

  start() {}

  update() {}
}

RE.registerComponent(Bot);