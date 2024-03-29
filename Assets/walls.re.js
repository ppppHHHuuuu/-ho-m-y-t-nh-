import RAPIER from '@dimforge/rapier3d-compat';
import * as RE from 'rogue-engine';

export default class walls extends RE.Component {
  @RE.props.text() colliderShapeVar = "box";
  awake() {

  }

  start() {
    // Get a reference to the entity this component is attached to
    const entity = new RAPIER.World({x: 0, y: 9.81, z: 0.0});

    // Create a Rapier collider based on the desired shape
    const colliderShape = this.colliderShapeVar; // Options: 'box', 'sphere', 'cylinder' (more available)
    let colliderDesc;

    switch (colliderShape) {
      case 'box':
        colliderDesc = RAPIER.ColliderDesc.cuboid(1, 2, 3); // Adjust dimensions (width, height, depth)
        break;
      default:
        RE.Debug.log('Unsupported collider shape. Using a box by default.');
        colliderDesc = RAPIER.ColliderDesc.cuboid(1, 2, 3);;
    }

    // Optionally, set collider properties for fine-tuning
    colliderDesc.isTrigger = false; // Set to true for non-solid walls (pass-through)
    colliderDesc.restitution = 0.2; // Adjust bounciness (0 = no bounce, 1 = full bounce)

    let handle = entity.createCollider(colliderDesc, this);

    // handle.setSensor(true);
    // setTimeout((e) => RE.Debug.log(handle), 1000);

  }

  update() {
      // RE.Debug.log("dsaf")
  }
}

RE.registerComponent(walls);
        