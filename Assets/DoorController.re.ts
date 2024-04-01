import * as RE from 'rogue-engine';
import * as THREE from 'three';
import RapierBody from '@RE/RogueEngine/rogue-rapier/Components/RapierBody.re';
import InputManager from './InputController.re'
import RAPIER, { Collider } from '@dimforge/rapier3d-compat';
const vZero = new THREE.Vector3();

export default class DoorController extends RE.Component {
  @RE.props.num() openAngle = 0.5 * Math.PI;
  @RE.props.checkbox() isOpen = false;
  private leftDoorList: string[];
  private rightDoorList: string[];
  private _rapierBody: RapierBody;
  private rotationSpeed: number;

  private hingePosition: THREE.Vector3; // Position of the door's hinge (in world space)
  get rapierBody() {
    if (!this._rapierBody) {
      this._rapierBody = RE.getComponent(RapierBody, this.object3d) as RapierBody;
    }
    return this._rapierBody;
  }

  awake() {
    this.hingePosition = new THREE.Vector3(1, 2, 0);
    this.leftDoorList = ["Door002", "Door019", "Door012", "Door009", "Door010", "Door004"];
    this.rightDoorList = ["Door013","Door003",  "Door001", "Door005", "Door007", "Door004", "Door008", "Door014", "Door012", "Door015", "Door016", "Door006"];
    this.rotationSpeed = (10 * Math.PI) / 180; // Example: 10 degrees/second
  }
  start() {
  }
  update() {
    // this.onCollisionEnter(this.object3d);

    const openDoorAction = RE.Input.keyboard.getKeyDown("Space")
      || RE.Input.mouse.isLeftButtonDown;
    if (openDoorAction == true) {
      // RE.Debug.log(this.object3d.name)
      if (!this.isOpen) {
        this.openDoor();
      }
      else {
        this.closeDoor();
      }
    }
  }
  openDoor() {
    const rotation = new THREE.Quaternion().setFromAxisAngle(vZero, this.openAngle);
    // this.object3d.quaternion.multiplyQuaternions(rotation, this.object3d.quaternion);
    // this.object3d.rotateOnWorldAxis(vZero,this.openAngle)
    // this.object3d.rotateOnWorldAxis( vZero,Math.PI / 4);
    // const group = new THREE.Group();
    // group.add(this.object3d);
    // this.object3d.position.set(0.5, 0.5, 0);
    // group.position.set(-0.5, -0.5, 0);
    // group.rotateZ(Math.PI/4)
    if (this.object3d.name in this.leftDoorList) {
      this.object3d.rotateY(this.openAngle);
    }
    else {
      this.object3d.rotateY(-this.openAngle);

    }
    // RE.Debug.log("openDoor")
    this.isOpen = true;
  }
  closeDoor() {
    // const rotation = new THREE.Quaternion().setFromAxisAngle(vZero,- this.openAngle);

    // this.object3d.quaternion.multiplyQuaternions(rotation, this.object3d.quaternion);
    // this.object3d.rotateOnWorldAxis(vZero, -this.openAngle)
    // RE.Debug.log("closeDoor")
    if (this.object3d.name in this.leftDoorList) {
      this.object3d.rotateY(-this.openAngle);
    }
    else {
      this.object3d.rotateY(this.openAngle)

    }
    this.isOpen = false;
  }

  onTriggerEnter(other) {
    // Xử lý khi có va chạm với nút bấm
    const openDoorAction = RE.Input.keyboard.getKeyDown("Space")
      || RE.Input.mouse.isLeftButtonDown;
    RE.Debug.log("abc")
    RE.Debug.log(String(openDoorAction))

  }

}

RE.registerComponent(DoorController);
