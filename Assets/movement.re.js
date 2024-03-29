import RapierBody from '@RE/RogueEngine/rogue-rapier/Components/RapierBody.re';
import * as RE from 'rogue-engine';

export default class movement extends RE.Component {

  awake() {
  }

  start() {
    this.a = RE.getComponent(RapierBody, this.object3d);
    RE.Debug.log(this.a.toJSON());
    this.a.onCollisionStart = (e) => {
      RE.Debug.log("e");
    }
  }

  update() {
    if(RE.Input.keyboard.getKeyDown("KeyW")){
    }
  }

}

RE.registerComponent(movement);
        