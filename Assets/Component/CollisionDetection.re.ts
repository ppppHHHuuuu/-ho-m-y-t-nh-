import * as RE from "rogue-engine";

export default class CollisionDetection {
  public static colliding(
    obj1: RE.Component,
    obj2: RE.Component,
    distance: number
  ) {
    const x1 = obj1.object3d.position.x;
    const y1 = obj1.object3d.position.y;
    const z1 = obj1.object3d.position.z;
    const x2 = obj2.object3d.position.x;
    const y2 = obj2.object3d.position.y;
    const z2 = obj2.object3d.position.z;

    return (
      Math.abs(
        (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) + (z1 - z2) * (z1 - z2)
      ) <= distance
    );
  }
}
