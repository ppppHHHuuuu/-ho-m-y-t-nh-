import RapierBall from "@RE/RogueEngine/rogue-rapier/Components/Colliders/RapierBall.re";
import RapierCollider from "@RE/RogueEngine/rogue-rapier/Components/Colliders/RapierCollider";
import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import * as RE from "rogue-engine";

export default class Collectable extends RE.Component {
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

RE.registerComponent(Collectable);
