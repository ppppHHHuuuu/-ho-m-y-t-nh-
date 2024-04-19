import * as RE from "rogue-engine";
import { degToRad } from "three/src/math/MathUtils";
import { Prop, Runtime } from "rogue-engine";
import { Camera, Vector3 } from "three";

const vector = new Vector3();
export default class RemoteMovement extends RE.Component {
  @Prop("Object3D")
  private model: THREE.Object3D;

  nextPosition: number = 0;
  nextRotation: number = 0;

  speed: number = 200;

  positionDirection: number;
  positionTime: number;

  rotationDirection: number;
  rotationTime: number;

  start() {
    this.setupPosition();
  }

  update() {
    if (this.positionTime > 0) {
      this.updatePosition();
    }

    this.nextPosition -= Runtime.deltaTime ;
    if (this.nextPosition < 0) {
      this.setupPosition();
      this.nextPosition = 1 + Math.abs(Math.random()) * 5;
    }

    if (this.rotationTime > 0) {
      this.updateRotation();
    }

    this.nextRotation -= Runtime.deltaTime ;
    if (this.nextRotation < 0) {
      this.setupRotation();
      this.nextRotation = 1 + Math.abs(Math.random()) * 5 ;
    }

    if (!this.model) {
      return;
    }

    Runtime.camera.getWorldPosition(vector);
    this.model.lookAt(vector);
  }

  updatePosition() {
    const { positionDirection } = this;
    const change = Runtime.deltaTime;
    this.object3d.position.y = Math.max(
      -1.5,
      Math.min(positionDirection, this.object3d.position.y + positionDirection * change)
    );
    this.positionTime -= change;
  }

  updateRotation() {
    const { rotationDirection, speed } = this;
    const change = Runtime.deltaTime * speed;
    this.object3d.rotateZ(degToRad(change * rotationDirection));
    this.rotationTime -= change;
  }

 setupPosition() {
    const { y } = this.object3d.position;
    this.positionDirection =
        Math.random() < .5 ? y - 0.5 : y + 0.5;

    this.positionTime = Math.random() * 1;
  }
  setupRotation() {
    this.rotationDirection = Math.random() < 0.5 ? -1.5 : 1.5;
    this.rotationTime = Math.random() * 45;
  }
}

RE.registerComponent(RemoteMovement);