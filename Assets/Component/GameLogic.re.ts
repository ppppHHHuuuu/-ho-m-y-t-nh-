import * as RE from "rogue-engine";
import Collectable from "./Collectable.re";
import PlayerController from "./PlayerController.re";
import { Vector3 } from "three";
import UIComponent from "./UIComponent.re";
import UIInGame from "./UIInGame.re";
import CollisionDetection from "./CollisionDetection.re";
import Door from "./Door.re";
import Bot from "./Bot.re";
export default class GameLogic extends RE.Component {
  @RE.props.prefab() collectable: RE.Prefab;
  @RE.props.prefab() player: RE.Prefab;
  @RE.props.prefab() singleDoor: RE.Prefab;
  @RE.props.prefab() doubleDoor: RE.Prefab;
  @RE.props.prefab() door: RE.Prefab;
  @RE.props.prefab() bot: RE.Prefab;

  gameStarted = false;
  collectableSet: Collectable[] = [];
  playerController: PlayerController;
  doorSet: Door[] = [];

  score = 0;
  collectedFlags: Boolean[] = [];
  collectableCount = 5;
  doorCount = Door.dimensions.length;

  //Bot properties
  botSet: Bot[] = [];
  botCount = 5;
  health = 100;
  damageFlags: Boolean[] = [];

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

        this.botSet.forEach((boot, index) => {
          this.botDamage(this.playerController, this.botSet, index);
        });

        if (this.health <= 0) {
        }
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
    const collide = CollisionDetection.colliding(obj1, obj2[index], 8);

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
        this.addCollectable(this.collectableSet[i], i * 3 + 18, 0, -12);
      }
    }
  }

  addCollectable(
    collectableObject: Collectable,
    x: number,
    y: number,
    z: number
  ) {
    collectableObject.object3d.position.set(x, 5.052, z);
    this.collectableSet.push(collectableObject);
  }

  addDoors() {
    for (let i = 0; i < this.doorCount; i++) {
      let doorInstance;

      if (Door.dimensions[i][3] === 0) {
        doorInstance = this.singleDoor.instantiate();
      } else {
        doorInstance = this.doubleDoor.instantiate();
      }

      if (doorInstance) {
        this.doorSet[i] = RE.getComponent(Door, doorInstance) as Door;
        this.addDoor(
          this.doorSet[i],
          Door.dimensions[i][0],
          Door.dimensions[i][1],
          Door.dimensions[i][2],
          Door.dimensions[i][4]
        );
      }
    }
  }

  addDoor(
    doorObject: Door,
    x: number,
    y: number,
    z: number,
    rotationY: number
  ) {
    doorObject.object3d.position.set(x, y, z);
    doorObject.object3d.rotateY(rotationY);
    // RE.Debug.log(x.toString() + "," + z.toString());
    this.doorSet.push(doorObject);
  }

  ///add Bot
  addBots() {
    for (let i = 1; i <= this.botCount; i++) {
      const botInstance = this.bot.instantiate();
      if (botInstance) {
        this.botSet[i] = RE.getComponent(Bot, botInstance) as Bot;
        this.addBot(this.botSet[i], i * 3 + 20, -20);
      }
    }
  }

  addBot(botObject: Bot, x: number, z: number) {
    botObject.object3d.position.set(x, 1, z);
    this.botSet.push(botObject);
  }

  //Bot Damage
  botDamage(obj1: RE.Component, obj2: RE.Component[], index: number) {
    const collide = CollisionDetection.colliding(obj1, obj2[index], 2);

    if (collide) {
      RE.Debug.log("true");
    } else {
      RE.Debug.log("false");
    }
    if (collide && !this.damageFlags[index]) {
      this.botSet[index].object3d.parent?.remove(this.botSet[index].object3d);
      this.health -= 20;
      this.damageFlags[index] = true;
      this.inGameUI.setHealth(this.health);
      if (this.health >= 0) {
        this.inGameUI.setHealthText(this.health);
      } else {
        this.inGameUI.setHealthText(0);
      }
      obj1.object3d.translateX(-5);
    }
  }

  startGame() {
    if (this.gameStarted === false) {
      this.startMenuUI.hide();
      this.inGameUI.show();
      this.inGameUI.setScore(0);
      this.inGameUI.setHealth(100);
      this.gameStarted = true;
      const playerInstance = this.player.instantiate();

      if (playerInstance) {
        playerInstance.position.set(20, 0.8, -18);
        this.playerController = RE.getComponent(
          PlayerController,
          playerInstance
        ) as PlayerController;

        this.addCollectables();
        this.addDoors();
        this.addBots();
        this.collectedFlags.push(false);
      }
    }
  }
}
RE.registerComponent(GameLogic);
