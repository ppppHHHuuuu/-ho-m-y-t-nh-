import * as RE from "rogue-engine";
import Collectable from "./Collectable.re";
import PlayerController from "./PlayerController.re";
import { Vector3 } from "three";
import UIComponent from "./UIComponent.re";
import UIInGame from "./UIInGame.re";
import CollisionDetection from "./CollisionDetection.re";
import Door from "./Door.re";
export default class GameLogic extends RE.Component {
  @RE.props.prefab() collectable: RE.Prefab;
  @RE.props.prefab() player: RE.Prefab;
  @RE.props.prefab() door: RE.Prefab;

  gameStarted = false;
  collectableSet: Collectable[] = [];
  playerController: PlayerController;
  doorSet: Door[] = [];

  score = 0;
  collectedFlags: Boolean[] = [];
  collectableCount = 5;
  doorCount = 10;

  stylesUI: UIComponent;
  startMenuUI: UIComponent;
  inGameUI: UIInGame;
  interactUI: UIComponent;

  awake() {}

  start() {
    this.stylesUI = RE.getComponentByName(
      "UIStyles",
      this.object3d
    ) as UIComponent;

    this.startMenuUI = RE.getComponentByName(
      "UIStartMenu",
      this.object3d
    ) as UIComponent;

    this.inGameUI = RE.getComponentByName(
      "UIInGame",
      this.object3d
    ) as UIInGame;

    this.interactUI = RE.getComponentByName(
      "UIInteract",
      this.object3d
    ) as UIComponent;

    if (this.stylesUI && this.startMenuUI) {
      this.stylesUI.show();
      this.startMenuUI.show();
    }
  }

  update() {
    if (this.gameStarted) {
      if (this.playerController) {
        this.collectableSet.forEach((collectable, index) => {
          this.collectItem(this.playerController, this.collectableSet, index);
        });

        this.doorSet.forEach((door, index) => {
          this.openDoorIn(this.playerController, this.doorSet, index);
        });
      }
    } else {
      const startAction = RE.Input.keyboard.getKeyDown("Space");
      if (startAction) {
        this.startGame();
      }
    }
  }

  collectItem(obj1: RE.Component, obj2: RE.Component[], index: number) {
    const collide = CollisionDetection.colliding(obj1, obj2[index], 4);

    if (collide && !this.collectedFlags[index]) {
      this.interactUI.show();
      const interactAction = RE.Input.mouse.isLeftButtonDown;
      if (interactAction) {
        this.interactUI.hide();
        this.collectableSet[index].object3d.parent?.remove(
          this.collectableSet[index].object3d
        );
        this.collectedFlags[index] = true;
        this.score++;
        this.inGameUI.setScore(this.score);
      }
    } else {
      setTimeout(() => {
        this.interactUI.hide();
      }, 100);
    }
  }

  openDoorIn(obj1: RE.Component, obj2: RE.Component[], index: number) {
    const collide = CollisionDetection.colliding(obj1, obj2[index], 4);

    if (collide) {
      this.interactUI.show();
      const interactAction = RE.Input.mouse.isLeftButtonDown;
      if (interactAction) {
        this.interactUI.hide();
        if (!this.doorSet[index].isOpen) {
          this.doorSet[index].openDoor();
        } else {
          this.doorSet[index].closeDoor();
        }
      }
    } else {
      setTimeout(() => {
        this.interactUI.hide();
      }, 100);
    }
  }

  addCollectables() {
    for (let i = 1; i <= this.collectableCount; i++) {
      const collectableInstance = this.collectable.instantiate();
      if (collectableInstance) {
        this.collectableSet[i] = RE.getComponent(
          Collectable,
          collectableInstance
        ) as Collectable;
        this.addCollectable(this.collectableSet[i], i * 3 + 18, -12);
      }
    }
  }

  addCollectable(collectableObject: Collectable, x: number, z: number) {
    collectableObject.object3d.position.set(x, 0.5, z);
    this.collectableSet.push(collectableObject);
  }

  addDoors() {
    for (let i = 1; i <= this.doorCount; i++) {
      RE.Debug.log("Add Doors");
      const doorInstance = this.door.instantiate();
      if (doorInstance) {
        this.doorSet[i] = RE.getComponent(Door, doorInstance) as Door;
        this.addDoor(this.doorSet[i], i * 2 + 18, -16);
      }
    }
  }

  addDoor(doorObject: Door, x: number, z: number) {
    doorObject.object3d.position.set(x, 1, z);
    // RE.Debug.log(x.toString() + "," + z.toString());
    this.doorSet.push(doorObject);
  }

  startGame() {
    if (this.gameStarted === false) {
      this.startMenuUI.hide();
      this.inGameUI.show();
      this.inGameUI.setScore(0);
      this.gameStarted = true;
      const playerInstance = this.player.instantiate();
      if (playerInstance) {
        this.playerController = RE.getComponent(
          PlayerController,
          playerInstance
        ) as PlayerController;

        this.addCollectables();
        this.addDoors();
        this.collectedFlags.push(false);
      }
    }
  }
}
RE.registerComponent(GameLogic);
