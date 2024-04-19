import * as RE from "rogue-engine";
import Collectable, { BookPosition, Direction } from "./Collectable.re";
import PlayerController from "./PlayerController.re";
import UIComponent from "./UIComponent.re";
import UIInGame from "./UIInGame.re";
import CollisionDetection from "./CollisionDetection.re";
import Door from "./Door.re";
import Bot, { BotPosition } from "./Bot.re";
import AudioManager from "./AudioManager.re";
import { Lighting } from "./Lighting.re"
export default class GameLogic extends RE.Component {
  @RE.props.prefab() collectable: RE.Prefab;
  @RE.props.prefab() player: RE.Prefab;
  @RE.props.prefab() singleDoor: RE.Prefab;
  @RE.props.prefab() lockedDoorModel: RE.Prefab;
  @RE.props.prefab() doubleDoor: RE.Prefab;
  @RE.props.prefab() bot: RE.Prefab;
  @RE.props.prefab() key: RE.Prefab;
  @RE.props.prefab() lightClass: RE.Prefab;
  @RE.props.prefab() lightCorridor: RE.Prefab;
  @RE.props.prefab() degree: RE.Prefab;

  private playCount: Number = 0;

  audioManager: AudioManager;
  gameStarted = false;
  gameLost = false;
  gameWinCondition = false;
  collectableSet: Collectable[] = [];
  keyCollectable: Collectable;
  degreeCollectable: Collectable;
  playerController: PlayerController;
  doorSet: Door[] = [];
  lockedDoor: Door;

  score = 0;
  collectedFlags: Boolean[] = [];
  showKey: Boolean;
  keyCollected: Boolean;
  degreeCollected: Boolean;
  collectableCount = 5;
  doorCount = Door.dimensions.length;

  botSet: Bot[] = [];
  botCount = 5;
  health = 100;
  damageFlags: Boolean[] = [];

  lightingSet: Lighting[] = [];


  stylesUI: UIComponent;
  startMenuUI: UIComponent;
  inGameUI: UIInGame;
  interactUI: UIComponent;
  lockedDoorUI: UIComponent;
  gameWinUI: UIComponent;
  endGameUI: UIComponent;
  collectKeyUI: UIComponent;
  hint1UI: UIComponent;
  showHintUI: UIComponent;
  showKeyUI: UIComponent;

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

    this.gameWinUI = RE.getComponentByName("UIWin", this.object3d) as UIInGame;
    this.endGameUI = RE.getComponentByName("UILose", this.object3d) as UIInGame;
    this.lockedDoorUI = RE.getComponentByName(
      "UILockedDoor",
      this.object3d
    ) as UIComponent;

    if (this.stylesUI && this.startMenuUI) {
      this.stylesUI.show();
      this.startMenuUI.show();
    }

    this.collectKeyUI = RE.getComponentByName(
      "UICollectKey",
      this.object3d
    ) as UIComponent;

    this.hint1UI = RE.getComponentByName(
      "UIHint1",
      this.object3d
    ) as UIComponent;

    this.showHintUI = RE.getComponentByName(
      "UIShowHint",
      this.object3d
    ) as UIComponent;

    this.showKeyUI = RE.getComponentByName(
      "UIShowKey",
      this.object3d
    ) as UIComponent;

    this.audioManager = RE.getComponentByName(
      "AudioManager",
      this.object3d
    ) as AudioManager;
  }

  update() {
    if (this.gameStarted) {
      if (this.playerController) {
        this.collectableSet.forEach((collectable, index) => {
          this.collectItem(this.playerController, this.collectableSet, index);
        });

        this.doorSet.forEach((door, index) => {
          this.openDoorIn(this.playerController, door);
        });

        this.openLockedDoor(this.playerController, this.lockedDoor);

        this.botSet.forEach((bot, index) => {
          this.botDamage(this.playerController, this.botSet, index);
        });

        this.collectDegree(this.playerController, this.degreeCollectable);

        if (this.health <= 0) {
          this.gameOver();
        }

        this.instantiateKey();

        if (this.keyCollectable) {
          this.collectKey(this.playerController, this.keyCollectable);
        }

        if (this.degreeCollected) {
          this.gameWin();
        }
      }
    } else {
      if (this.gameLost == true || this.gameWinCondition == true) {
        const replayAction = RE.Input.keyboard.getKeyDown("KeyR");
        if (replayAction) {
          this.startGame();
        }
      } else {
        const startAction = RE.Input.keyboard.getKeyDown("Space");
        if (startAction) {
          this.startGame();
        }
      }
    }
  }

  collectItem(obj1: RE.Component, obj2: RE.Component[], index: number) {
    const collide = CollisionDetection.colliding(obj1, obj2[index], 4);

    if (collide && !this.collectedFlags[index]) {
      this.interactUI.show();
      const interactAction = RE.Input.mouse.isLeftButtonDown;
      if (interactAction) {
        this.audioManager.playSFX(this.audioManager.sfx_collect);
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

  collectKey(obj1: RE.Component, obj2: RE.Component) {
    const collide = CollisionDetection.colliding(obj1, obj2, 10);

    if (collide && !this.keyCollected) {
      this.collectKeyUI.show();
      const interactAction = RE.Input.mouse.isLeftButtonDown;
      if (interactAction) {
        this.showKeyUI.show();
        this.audioManager.playSFX(this.audioManager.sfx_key);
        this.collectKeyUI.hide();
        this.keyCollectable.object3d.parent?.remove(
          this.keyCollectable.object3d
        );
        this.keyCollected = true;
      }
    } else {
      setTimeout(() => {
        this.collectKeyUI.hide();
      }, 100);
    }
  }

  collectDegree(obj1: RE.Component, obj2: RE.Component) {
    const collide = CollisionDetection.colliding(obj1, obj2, 10);
    if (collide && !this.degreeCollected) {
      this.interactUI.show();
      const interactAction = RE.Input.mouse.isLeftButtonDown;
      if (interactAction) {
        this.interactUI.hide();
        this.degreeCollectable.object3d.parent?.remove(
          this.degreeCollectable.object3d
        );
        this.degreeCollected = true;
      }
    } else {
      setTimeout(() => {
        this.interactUI.hide();
      }, 100);
    }
  }

  openDoorIn(obj1: RE.Component, obj2: Door) {
    const collide = CollisionDetection.colliding(obj1, obj2, 8);

    if (collide) {
      this.interactUI.show();
      const interactAction = RE.Input.mouse.isLeftButtonDown;
      if (interactAction) {
        this.audioManager.playSFX(this.audioManager.sfx_door);
        this.interactUI.hide();
        if (!obj2.isOpen) {
          obj2.openDoor();
        } else {
          obj2.closeDoor();
        }
      }
    } else {
      setTimeout(() => {
        this.interactUI.hide();
      }, 100);
    }
  }

  openLockedDoor(obj1: RE.Component, obj2: Door) {
    const collide = CollisionDetection.colliding(obj1, obj2, 8);

    if (collide) {
      if (!this.keyCollected) {
        this.lockedDoorUI.show();
        const interactAction = RE.Input.mouse.isLeftButtonDown;
        if (interactAction) {
          this.audioManager.playSFX(this.audioManager.sfx_locked_door);
        }
      } else {
        this.interactUI.show();
        const interactAction = RE.Input.mouse.isLeftButtonDown;
        if (interactAction) {
          this.showKeyUI.hide();
          this.audioManager.playSFX(this.audioManager.sfx_unlock_door);
          this.interactUI.hide();
          if (!obj2.isOpen) {
            obj2.openDoor();
          } else {
            obj2.closeDoor();
          }
        }
      }
    } else {
      setTimeout(() => {
        this.interactUI.hide();
        this.lockedDoorUI.hide();
      }, 100);
    }
  }

  addCollectables() {
    for (let i = 0; i < Collectable.bookPosition.length; i++) {
      const collectableInstance = this.collectable.instantiate();
      if (collectableInstance) {
        this.collectableSet[i] = RE.getComponent(
          Collectable,
          collectableInstance
        ) as Collectable;
        this.addCollectable(this.collectableSet[i], Collectable.bookPosition[i].x, Collectable.bookPosition[i].y, Collectable.bookPosition[i].z);
      }
    }
  }

  addCollectable(
    collectableObject: Collectable,
    x: number,
    y: number,
    z: number
  ) {
    collectableObject.object3d.position.set(x, y, z);
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
        this.doorSet[i].closeDoor();
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
    this.doorSet.push(doorObject);
  }
  addLights() {
    for (let i = 0; i < Lighting.lightClassPosition.length; i++) {
      // RE.Debug.log(Lighting.lightPosition[i].x + " " + Lighting.lightPosition[i].y)
      let lightingClassInstance;

      lightingClassInstance = this.lightClass.instantiate();
      if (lightingClassInstance) {
        this.lightingSet[i] = RE.getComponent(
          Lighting,
          lightingClassInstance
        ) as Lighting;
        this.addLight(
          this.lightingSet[i],
          Lighting.lightClassPosition[i].x,
          Lighting.lightClassPosition[i].y,
          Lighting.lightClassPosition[i].z
        );
      }
    }
    for (let i = 0; i < Lighting.lightCorridorPosition.length; i++) {
      let lightingCorridorInstance;
      lightingCorridorInstance = this.lightCorridor.instantiate();
      if (lightingCorridorInstance) {
        this.lightingSet[i] = RE.getComponent(
          Lighting,
          lightingCorridorInstance
        ) as Lighting;
        this.addLight(
          this.lightingSet[i],
          Lighting.lightCorridorPosition[i].x,
          Lighting.lightCorridorPosition[i].y,
          Lighting.lightCorridorPosition[i].z
        );
      }
    }

  }

  addLight(lightObject: Lighting, x: number, y: number, z: number) {
    lightObject.object3d.position.set(x, y, z);
    this.lightingSet.push(lightObject);
  }
  ///add Bot
  addBots() {
    for (let i = 0; i < Bot.botPosition.length; i++) {

      let botInstance;
      botInstance = this.bot.instantiate();
      if (botInstance) {
        this.botSet[i] = RE.getComponent(
          Bot, 
          botInstance
        ) as Bot;
        if (i == 1){ 
            RE.Debug.log(Bot.botPosition[i].x + " " + Bot.botPosition[i].y + " " + Bot.botPosition[i].z)
        }

        this.addBot(
          this.botSet[i], 
          Bot.botPosition[i].x, 
          Bot.botPosition[i].y, 
          Bot.botPosition[i].z);
      }
    }
  }

 addBot(botObject: Bot, x: number, y: number, z: number) {
    botObject.object3d.position.set(x, y, z);
    this.botSet.push(botObject);
  } 

  //Bot Damage
  botDamage(obj1: RE.Component, obj2: RE.Component[], index: number) {
    const collide = CollisionDetection.colliding(obj1, obj2[index], 2);
    if (collide && !this.damageFlags[index]) {
      this.audioManager.playSFX(this.audioManager.sfx_damage);
      this.botSet[index].object3d.parent?.remove(this.botSet[index].object3d);
      this.health -= 5;
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
      this.gameLost = false;
      this.startMenuUI.hide();
      this.gameWinUI.hide();
      this.endGameUI.hide();
      this.inGameUI.show();
      this.inGameUI.setScore(0);
      this.inGameUI.setHealth(100);
      this.gameStarted = true;
      const playerInstance = this.player.instantiate();
      const degreeInstance = this.degree.instantiate();
      const lockedDoorInstance = this.lockedDoorModel.instantiate();
      this.showKey = false;
      this.keyCollected = false;
      this.degreeCollected = false;

      if (playerInstance) {
        playerInstance.position.set(20, 0.8, -18);
        this.playerController = RE.getComponent(
          PlayerController,
          playerInstance
        ) as PlayerController;
        this.addCollectables();
        this.addDoors();
        this.addLights()
        this.addBots();
        for (let i = 0; i < this.collectableCount; i++) {
          this.collectedFlags.push(false);
        }
      }

      if (degreeInstance) {
        degreeInstance.position.set(41, 5.1, -5);
        this.degreeCollectable = RE.getComponent(
          Collectable,
          degreeInstance
        ) as Collectable;
      }

      if (lockedDoorInstance) {
        lockedDoorInstance.position.set(42.226, 5.052, -16.081);
        this.lockedDoor = RE.getComponent(Door, lockedDoorInstance) as Door;
      }
    }
  }

  deleteAll() {
    this.collectableSet.forEach((collectable) => {
      collectable.object3d.parent?.remove(collectable.object3d);
    });

    this.collectableSet = [];

    this.doorSet.forEach((door) => {
      door.object3d.parent?.remove(door.object3d);
    });

    this.doorSet = [];

    this.botSet.forEach((bot) => {
      bot.object3d.parent?.remove(bot.object3d);
    });

    this.botSet = [];

    this.lightingSet.forEach((lighting) => {
      lighting.object3d.parent?.remove(lighting.object3d);
    });
    this.lightingSet = []

  }

  gameOver() {
    this.gameStarted = false;
    this.gameLost = true;
    this.health = 100;
    this.inGameUI.hide();
    this.endGameUI.show();
    this.collectedFlags = [];
    this.damageFlags = [];
    this.degreeCollected = false;
    this.keyCollected = false;
    this.deleteAll();
    this.showHintUI.hide();
  }

  gameWin() {
    this.gameStarted = false;
    this.gameWinCondition = true;
    this.health = 100;
    this.inGameUI.hide();
    this.gameWinUI.show();
    this.collectedFlags = [];
    this.damageFlags = [];
    this.degreeCollected = false;
    this.keyCollected = false;
    this.deleteAll();
    this.showHintUI.hide();
  }

  hintHidden = true;
  hintShowHidden = false;

  instantiateKey() {
    if (this.allCollected() && !this.showKey && !this.keyCollectable) {
      this.hint1UI.show();
      this.hintHidden = false;
      const keyInstance = this.key.instantiate();
      if (keyInstance) {
        keyInstance.position.set(37.731, 1.034, 36.92);
        this.keyCollectable = RE.getComponent(
          Collectable,
          keyInstance
        ) as Collectable;

        this.showKey = true;
      }
    }

    // Check for the X key press regardless of whether the hint is shown or not
    const interaction = RE.Input.keyboard.getKeyDown("KeyX");
    if (interaction) {
      if (!this.hintHidden) {
        this.hint1UI.hide();
        this.showHintUI.show();
        this.hintShowHidden = false;
        this.hintHidden = true;
      } else {
        this.hint1UI.show();
        this.showHintUI.hide();
        this.hintShowHidden = true;
        this.hintHidden = false;
      }
    }
  }

  allCollected() {
    return this.collectedFlags.every((flag) => flag === true) && this.collectedFlags.length != 0;
    // return true;
  }
}
RE.registerComponent(GameLogic);