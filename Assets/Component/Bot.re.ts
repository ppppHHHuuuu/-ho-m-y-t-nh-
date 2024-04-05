import * as RE from "rogue-engine";
import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import RapierCollider from "@RE/RogueEngine/rogue-rapier/Components/Colliders/RapierCollider";

export default class Bot extends RE.Component {
  private _rapierBody: RapierBody;
  private _collider: RapierCollider;

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
