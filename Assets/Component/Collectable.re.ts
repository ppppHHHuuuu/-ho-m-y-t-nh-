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

  curBook: THREE.Object3D[] = [];
  
  private floorHeight = [
    0, 0, 5.052,
  ]
  private startTime : number = 0;
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
  generateRandomPosition(Build: Building): BookPosition {
    var constraintX: {[key: string]: number}
    var constraintZ: {[key: string]: number}
    var fixedY: number
    if (Build = Building.Right) {
      constraintX = {min: 2.681, max: 97.681}
      constraintZ = {min: 20.877, max: 51.2}
      fixedY = 0 +this.bookHeight
    }
    else if (Build = Building.Left1stFloor) {
      constraintX = {min: 2.524, max: 27.524}
      constraintZ = {min: -1.523, max: -21.523}
      fixedY = 0+this.bookHeight
    }
    else {
      constraintX = {min: 2.524, max: 125.524}
      constraintZ = {min: -1.523, max: -93}
      fixedY = 5.052+this.bookHeight
    }
    const x = Math.floor(Math.random() * (constraintX.max - constraintX.min + 1)) + constraintX.min
    const z = Math.floor(Math.random() * (constraintZ.max - constraintZ.min + 1)) + constraintZ.min 
    
    return {x: x, y: fixedY, z: z, direction: Direction.East}
  }


  update() {
    this.startTime = (this.startTime + RE.Runtime.deltaTime ) % 1000; 
    let y = Math.cos(this.startTime / this.bouncingSpeed  * 360) * this.bouncingHeight;
    // RE.Debug.log("" + y + " " +  w.y + " " + Math.sin(this.startTime / this.bouncingSpeed * 360))
    this.object3d.translateY(y);
  }
}

RE.registerComponent(Collectable);
