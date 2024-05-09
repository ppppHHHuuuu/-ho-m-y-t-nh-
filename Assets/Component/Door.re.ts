import * as RE from "rogue-engine";
import * as THREE from "three";
import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import RAPIER, { Collider } from "@dimforge/rapier3d-compat";
import CollisionDetection from "./CollisionDetection.re";
const vZero = new THREE.Vector3();

export default class Door extends RE.Component {
  @RE.props.num() openAngle = 0.5 * Math.PI;
  @RE.props.checkbox() isOpen = false;
  private leftDoorList: string[];
  private rightDoorList: string[];
  private _rapierBody: RapierBody;
  doorDimensions: THREE.Vector3[];
  private rotationSpeed: number;
  private hingePosition: THREE.Vector3; // Position of the door's hinge (in world space)
  public static dimensions = [
    [18.28, 5.052, -50.721, 0.0, 0.5 * Math.PI, 201],
    [18.28, 5.052, -61.579, 0.0, 0.5 * Math.PI, 202],
    [30.624, 5.052, -76.562, 0.0, 0, 203],
    [49.264, 5.052, -76.606, 0.0, 0, 204],
    [28.025, 5.052, -30.04, 0.0, 0.5 * Math.PI, 205],
    [28.167, 5.052, -43.752, 0.0, 0.5 * Math.PI, 206],
    [28.075, 5.052, -58.842, 0.0, 0.5 * Math.PI, 207],
    [31.535, 5.052, -16.081, 0.0, 0, 1.0],
    // [42.226, 5.052, -16.081, 0.0, 0, 2],
    [20.353, 5.052, -21.673, 1.0, 0, 3],
    [21.693, 5.052, -21.673, 1.0, Math.PI, 4],
    [67.65, 5.052, -57.93, 0.0, 0.5 * Math.PI, 208],
    [67.751, 5.052, -10.936, 0.0, 0.5 * Math.PI, 211],
    [67.715, 5.052, -44.886, 0.0, 0.5 * Math.PI, 209],
    [67.789, 5.052, -29.43, 0.0, 0.5 * Math.PI, 210],
    [103.297, 5.052, -24.241, 0.0, 0.5 * Math.PI, 214],
    [103.417, 5.052, -39.83, 0.0, 0.5 * Math.PI, 215],
    [103.169, 5.052, -54.894, 0.0, 0.5 * Math.PI, 216],
    [103.232, 5.052, -69.373, 0.0, 0.5 * Math.PI, 217],
    [92.86, 5.052, -76.481, 0.0, 0, 5],
    [14.014, 1.05, 28.602, 0.0, Math.PI, 101],
    [17.876, 1.05, 37.34, 0.0, Math.PI, 102.1],
    [27.057, 1.05, 37.361, 0.0, Math.PI, 102.2],
    [34.809, 1.05, 37.34, 0.0, Math.PI, 103],
    [44.15, 1.05, 37.359, 0.0, Math.PI, 104.1],
    [53.549, 1.05, 37.332, 0.0, Math.PI, 104.2],
    [59.269, 1.05, 37.34, 0.0, Math.PI, 105.1],
    [68.542, 1.05, 37.339, 0.0, Math.PI, 105.2],
    [74.644, 1.05, 37.339, 0.0, Math.PI, 106.1],
    [83.741, 1.05, 37.339, 0.0, Math.PI, 106.2],
    [95.48, 1.05, 38.877, 0.0, 0, 6],
    [90.253, 1.05, 37.98, 0.0, 0, 7],
    [20.257, 1.05, -1.67, 1.0, Math.PI, 8],
    [18.917, 1.05, -1.67, 1.0, 0, 9],
  ];

  get rapierBody() {
    if (!this._rapierBody) {
      this._rapierBody = RE.getComponent(
        RapierBody,
        this.object3d
      ) as RapierBody;
    }
    return this._rapierBody;
  }

  openDoor() {
    if (!this.isOpen) {
      this.object3d.rotateY(this.openAngle);
      this.isOpen = true;
    }
  }

  closeDoor() {
    if (this.isOpen) {
      this.object3d.rotateY(-this.openAngle);
      this.isOpen = false;
    }
  }

  awake() {}
}

RE.registerComponent(Door);
