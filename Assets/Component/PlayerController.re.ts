import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import * as RE from "rogue-engine";

export default class PlayerController extends RE.Component {
  private _rapierBody: RapierBody;

  get rapierBody() {
    if (!this._rapierBody) {
      this._rapierBody = RE.getComponent(
        RapierBody,
        this.object3d
      ) as RapierBody;
    }

    return this._rapierBody;
  }

  update() {
    // RE.Debug.log(this.object3d.position.x.toString());
  }

  start() {}
}

RE.registerComponent(PlayerController);