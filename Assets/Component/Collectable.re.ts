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
    { x: 47.779, y: 1.181, z: 44.362, direction: Direction.West },
    { x: 53.943, y: 1.181, z: 44.362, direction: Direction.West },
    { x: 63.683, y: 1.181, z: 44.362, direction: Direction.West },
    { x: 89.938, y: 1.181, z: 44.362, direction: Direction.West },
    { x: 95.279, y: 1.181, z: 31.597, direction: Direction.West },
    { x: 95.777, y: 1.181, z: 44.362, direction: Direction.West },
    
    { x: 41, y: 5, z: -90, direction: Direction.East },
    { x: 47, y: 5, z: -7.7, direction: Direction.South },
    { x: 44, y: 5, z: -42, direction: Direction.South },
    { x: 5, y: 5, z: -57, direction: Direction.South },
    { x: 7, y: 5, z: -53, direction: Direction.South },
    { x: 2.8, y: 5, z: -61, direction: Direction.South },
    { x: 47, y: 5, z: - 46, direction: Direction.North },
    { x: 51, y: 5, z: -14, direction: Direction.South },
    { x: 51, y: 5, z: -4, direction: Direction.South },
    { x: 45, y: 5, z: -60, direction: Direction.North },
    { x: 46, y: 5, z: -24, direction: Direction.North },
    { x: 45, y: 5, z: -30, direction: Direction.North },
    { x: 30, y: 5, z: -32, direction: Direction.North },
    { x: 45, y: 5, z: -62, direction: Direction.North },
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
