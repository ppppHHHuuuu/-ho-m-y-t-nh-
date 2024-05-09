import RapierBall from "@RE/RogueEngine/rogue-rapier/Components/Colliders/RapierBall.re";
import RapierCollider from "@RE/RogueEngine/rogue-rapier/Components/Colliders/RapierCollider";
import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import * as RE from "rogue-engine";
import * as THREE from 'three'

export enum Building{
  Right,
  Left1stFloor,
  Left2ndFloor
}
export enum Direction {
  South,
  East,
  West,
  North
}
export interface BookPosition {
  x: number;
  y: number;
  z: number;
  direction: number;
}

export default class Collectable extends RE.Component {

  @RE.props.num() bouncing = true;
  @RE.props.num() bouncingHeight = 0.01;
  @RE.props.num() bouncingSpeed = 100;
  @RE.props.num() bookHeight = 0.7;
  public static bookPosition: BookPosition[] = [
    { x: 54.518, y: 1.181, z: 44.362, direction: Direction.South },
    // { x: 53.943, y: 1.181, z: 44.362, direction: Direction.South },
    { x: 63.683, y: 1.181, z: 44.362, direction: Direction.South },
    { x: 89.938, y: 1.181, z: 44.362, direction: Direction.South },
    // { x: 95.279, y: 1.181, z: 44.362, direction: Direction.South },
    { x: 95.777, y: 1.181, z: 31.597, direction: Direction.South },
    { x: 68.921, y: 1.181, z: 31.597, direction: Direction.South },
    { x: 68.921, y: 1.181, z: 31.597, direction: Direction.South },

    // { x: 47, y: 5, z: -7.7, direction: Direction.South },
    { x: 72.816, y: 5, z: -11.739, direction: Direction.East },
    { x: 81.066, y: 5, z: -57, direction: Direction.South },
    { x: 41, y: 5, z: -71.299, direction: Direction.South },
    { x: 11.628, y: 5, z: -59, direction: Direction.South },
    { x: 6.889, y: 5, z: -54, direction: Direction.North },
    { x: 91.268, y: 5, z: -11.229, direction: Direction.South },
    { x: 20, y: 5, z: -49, direction: Direction.East },
    { x: 45, y: 5, z: -60, direction: Direction.South },
    { x: 38.479, y: 5, z: -29.027, direction: Direction.South },
    { x: 41.526, y: 5, z:-18, direction: Direction.South },
    { x: 45, y: 5, z: -43.594, direction: Direction.South },
    { x: 10.926, y: 5, z: -30, direction: Direction.North },

  ];
  curBook: THREE.Object3D[] = [];
  
  private floorHeight = [
    0, 0, 5.052,
  ]
  private startTime : number = 0;
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
    this.startTime = (this.startTime + RE.Runtime.deltaTime ) % 1000; 
    let y = Math.cos(this.startTime / this.bouncingSpeed  * 360) * this.bouncingHeight;
    // RE.Debug.log("" + y + " " +  w.y + " " + Math.sin(this.startTime / this.bouncingSpeed * 360))
    this.object3d.translateY(y);
  }
}

RE.registerComponent(Collectable);
