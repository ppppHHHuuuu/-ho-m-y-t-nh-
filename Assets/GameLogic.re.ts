import * as RE from 'rogue-engine';
import RapierBody from '@RE/RogueEngine/rogue-rapier/Components/RapierBody.re';
import { BoxHelper, Vector3 } from 'three';
export default class GameLogic extends RE.Component {
  bodyComponent: RapierBody
  direction: Vector3
  boxHelper: BoxHelper
  awake() {
    this.bodyComponent = RE.getComponent(RapierBody, this.object3d) as RapierBody;
    this.bodyComponent.type = 0
    this.direction = new Vector3()
    this.boxHelper = new BoxHelper(this.object3d);
  }

  start() {
    this.direction.set(0, 0, -1);

  }

  update() {
    const doorDirection = this.bodyComponent.object3d.getWorldDirection(this.direction);

    const angle = Math.abs(this.direction.angleTo(doorDirection) * (180 / Math.PI));
    if (angle != 0) {
      RE.Debug.log(angle.toString())

    }
  }
}

RE.registerComponent(GameLogic);
