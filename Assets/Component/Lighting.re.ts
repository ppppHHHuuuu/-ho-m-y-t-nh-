import * as THREE from 'three'
import * as RE from "rogue-engine";
import RapierBody from "@RE/RogueEngine/rogue-rapier/Components/RapierBody.re";
import { Material } from 'cannon-es';

export interface LightPosition {
    x: number;
    y: number;
    z: number;
  }
  
export class Light extends RE.Component {

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
}