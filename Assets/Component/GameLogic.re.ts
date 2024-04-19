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
  private botPosition: BotPosition[] = [
    { x: 59.5, y: 1, z: 47.5 },
    { x: 40.5, y: 5, z: -87.0 },
    { x: 45.5, y: 5, z: -46.0 },
    { x: 59.5, y: 1, z: 44.3 }, 
    { x: 41.5, y: 5, z: -84.0 }, { x: 46.0, y: 5.2, z: -44.0 },
    { x: 62.8, y: 1.5, z: 44.5 }, { x: 38.8, y: 5, z: -89.0 }, { x: 42.0, y: 5.1, z: -44.5 },
    { x: 66.8, y: 1, z: 44.5 }, { x: 38.8, y: 5, z: -86.0 }, { x: 40.0, y: 5, z: -44.0 },
    { x: 70.2, y: 1.3, z: 40.9 }, { x: 35.0, y: 5, z: -84.0 }, { x: 19.5, y: 5.3, z: -23.0 },

    { x: 27.7, y: 1.2, z: 48.2 }, { x: 44.0, y: 5, z: -7.7 }, { x: 65.5, y: 5.2, z: -10.5 },
    { x: 27.9, y: 1.2, z: 44.7 }, { x: 41.5, y: 5, z: -6.2 }, { x: 66.3, y: 5.5, z: -9.2 },
    { x: 24.1, y: 1.2, z: 44.3 }, { x: 41.6, y: 5, z: -10.3 }, { x: 41.0, y: 5, z: -59.5 },
    { x: 18.5, y: 1.2, z: 41.2 }, { x: 44.5, y: 5, z: -10.2 }, { x: 43.3, y: 5, z: -58.5 },
    { x: 27.8, y: 1.2, z: 41.2 }, { x: 42.0, y: 5, z: -12.6 }, { x: 43.0, y: 5.3, z: -62.0 },

    { x: 95.8, y: 1.35, z: 47.8 }, { x: 45.0, y: 5, z: -43.5 }, { x: 46.5, y: 5.3, z: -27.0 },
    { x: 94.7, y: 1.15, z: 43.4 }, { x: 42.5, y: 5, z: -42.6 }, { x: 30.5, y: 5.3, z: -29.0 },
    { x: 96.6, y: 1.2, z: 41.5 }, { x: 39.5, y: 5, z: -44.3 },
    { x: 95.2, y: 1.1, z: 40.8 }, { x: 37.5, y: 5, z: -43.1 },
    { x: 97.2, y: 1.17, z: 39.0 }, { x: 35.8, y: 5, z: -44.5 },

    { x: 85.2, y: 1.17, z: 30.0 }, { x: 7.2, y: 5, z: -56.2 },
    { x: 87.0, y: 1.1, z: 28.0 }, { x: 5.3, y: 5.5, z: -60 },
    { x: 87.0, y: 1.1, z: 32.0 }, { x: 7.0, y: 5.2, z: -61.0 },
    { x: 88.5, y: 1.1, z: 29.0 }, { x: 5.8, y: 5.8, z: -54.5 },
    { x: 88.5, y: 1.1, z: 31.0 }, { x: 14.2, y: 5.4, z: -55.8 },

    { x: 65.2, y: 1.2, z: 30.0 }, { x: 7.0, y: 5.4, z: -50.0 },
    { x: 67.0, y: 1.1, z: 28.0 }, { x: 5.5, y: 5.35, z: -49.5 },
    { x: 67.0, y: 1.1, z: 32.0 }, { x: 5.5, y: 5.5, z: -48.5 },
    { x: 68.5, y: 1.1, z: 29.0 },
    { x: 68.5, y: 1.1, z: 31.0 },
  ]
  
  private bookPosition: BookPosition[] = [
    { x: 58, y: 1, z: 48.9, direction: Direction.West },
    { x: 27, y: 1, z: 47, direction: Direction.West },
    { x: 22, y: 1, z: 44, direction: Direction.West },
    { x: 95, y: 2, z: 48, direction: Direction.West },
    { x: 96, y: 1, z: 43, direction: Direction.West },
    { x: 87, y: 1, z: 30, direction: Direction.South },
    { x: 67, y: 1, z: 30, direction: Direction.South },

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

        this.botSet.forEach((boot, index) => {
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
    for (let i = 0; i < this.bookPosition.length; i++) {
      const collectableInstance = this.collectable.instantiate();
      if (collectableInstance) {
        this.collectableSet[i] = RE.getComponent(
          Collectable,
          collectableInstance
        ) as Collectable;
        this.addCollectable(this.collectableSet[i], this.bookPosition[i].x, this.bookPosition[i].y, this.bookPosition[i].z);
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
      let lightingCorridorInstance;

      lightingClassInstance = this.lightClass.instantiate();
      lightingCorridorInstance = this.lightCorridor.instantiate();
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
    // //RE.Debug.log(x.toString() + "," + z.toString());
    this.lightingSet.push(lightObject);
  }
  ///add Bot
  addBots() {
    for (let i = 0; i < this.botPosition.length; i++) {
      const botInstance = this.bot.instantiate();
      if (botInstance) {
        this.botSet[i] = RE.getComponent(Bot, botInstance) as Bot;
        this.addBot(this.botSet[i], this.botPosition[i].x, this.botPosition[i].y, this.botPosition[i].z);
      }
    }
  }

  addBot(botObject: Bot, x: number, y:number, z: number) {
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
    RE.Debug.log(this.doorSet.length.toString());
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