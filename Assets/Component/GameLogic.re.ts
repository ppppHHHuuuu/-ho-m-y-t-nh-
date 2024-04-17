import * as RE from "rogue-engine";
import Collectable from "./Collectable.re";
import PlayerController from "./PlayerController.re";
import UIComponent from "./UIComponent.re";
import UIInGame from "./UIInGame.re";
import CollisionDetection from "./CollisionDetection.re";
import Door from "./Door.re";
import Bot from "./Bot.re";
import { LightPosition, Light } from "./Lighting.re";
import { BookPosition, Direction } from "./Collectable.re";
import AudioManager from "./AudioManager.re";
export default class GameLogic extends RE.Component {
  @RE.props.prefab() collectable: RE.Prefab;
  @RE.props.prefab() player: RE.Prefab;
  @RE.props.prefab() singleDoor: RE.Prefab;
  @RE.props.prefab() lockedDoorModel: RE.Prefab;
  @RE.props.prefab() doubleDoor: RE.Prefab;
  @RE.props.prefab() bot: RE.Prefab;
  @RE.props.prefab() key: RE.Prefab;
  @RE.props.prefab() light: RE.Prefab;
  @RE.props.prefab() degree: RE.Prefab;

  private lightPosition: LightPosition[] = [
    {x: 13.7872, y: 61.8854, z: 7.783},
    {x: 13.7872, y: 55.1753, z: 7.7871},
    {x: 7.1268, y: 55.1753, z: 7.7871},
    {x: 7.1268, y: 61.612, z: 7.78},
    {x: 13.7872, y: 42.3951, z: 7.7871},
    {x: 8.3762, y: 42.3951, z: 7.78},
    {x: 8.3762, y: 31.7277, z: 7.7871},
    {x: 13.7357, y: 31.7277, z: 7.7871},
    {x: 32.9576, y: 40.3939, z: 7.7871},
    {x: 37.3894, y: 40.3939, z: 7.7871},
    {x: 41.4606, y: 40.3939, z: 7.7871},
    {x: 45.5317, y: 40.3939, z: 7.7871},
    {x: 54.3789, y: 55.0896, z: 7.7871},
    {x: 57.9454, y: 55.0789, z: 7.7871},
    {x: 61.3994, y: 55.1158, z: 7.7871},
    {x: 54.3789, y: 48.2636, z: 7.7871},
    {x: 57.9454, y: 48.2529, z: 7.7871},
    {x: 61.3994, y: 48.2898, z: 7.7871},
    {x: 54.3789, y: 40.7054, z: 7.7871},
    {x: 57.9454, y: 40.6947, z: 7.7871},
    {x: 54.3789, y: 62.6478, z: 7.7871},
    {x: 57.9454, y: 62.6371, z: 7.7871},
    {x: 61.3994, y: 62.674, z: 7.7871},
    {x: 61.3994, y: 40.7316, z: 7.7871},
    {x: 54.3789, y: 32.2251, z: 7.7871},
    {x: 57.9454, y: 32.2144, z: 7.7871},
    {x: 61.3994, y: 32.2514, z: 7.7871},
    {x: 54.3789, y: 24.6669, z: 7.7871},
    {x: 48.1084, y: 88.3075, z: 7.7871},
    {x: 48.1084, y: 80.7868, z: 7.7871},
    {x: 71.3518, y: 88.3075, z: 7.7871},
    {x: 71.3518, y: 80.7868, z: 7.7871},
    {x: 55.7854, y: 88.3075, z: 7.7871},
    {x: 64.331, y: 88.3075, z: 7.7871},
    {x: 32.5247, y: 33.5933, z: 7.7871},
    {x: 36.9566, y: 33.5933, z: 7.7871},
    {x: 41.0277, y: 33.5933, z: 7.7871},
    {x: 45.0988, y: 33.5933, z: 7.7871},
    {x: 109.0001, y: 43.1218, z: 7.7871},
    {x: 116.7816, y: 43.1218, z: 7.7871},
    {x: 109.0001, y: 35.3344, z: 7.7871},
    {x: 116.7816, y: 35.3344, z: 7.7871},
    {x: 109.0001, y: 57.7666, z: 7.7871},
    {x: 116.7816, y: 57.7666, z: 7.7871},
    {x: 109.0001, y: 28.5334, z: 7.7871},
    {x: 116.7816, y: 28.5334, z: 7.7871},
    {x: 88.1683, y: 8.6964, z: 7.7871},
    {x: 102.8408, y: 8.6964, z: 7.7871},
    {x: 111.4387, y: 8.6964, z: 7.7871},
    {x: 119.8139, y: 8.6964, z: 7.7871},
    {x: 94.1791, y: 8.6964, z: 7.7871},
    {x: 32.9576, y: 47.9833, z: 7.7871},
    {x: 37.3894, y: 47.9833, z: 7.7871},
    {x: 41.4606, y: 47.9833, z: 7.7871},
    {x: 45.5317, y: 47.9833, z: 7.7871},
    {x: 32.5247, y: 63.4651, z: 7.7871},
    {x: 36.9566, y: 63.4651, z: 7.7871},
    {x: 41.0277, y: 63.4651, z: 7.78},
    {x: 45.0988, y: 63.4651, z: 7.7871},
    {x: 32.5247, y: 55.0217, z: 7.7871},
    {x: 36.9566, y: 55.0217, z: 7.7871},
    {x: 41.0277, y: 55.0217, z: 7.7871},
    {x: 45.0988, y: 55.0217, z: 7.7871},
    {x: 32.5247, y: 25.9839, z: 7.7871},
    {x: 36.9566, y: 25.9839, z: 7.7871},
    {x: 41.0277, y: 25.9839, z: 7.7871},
    {x: 45.0988, y: 25.9839, z: 7.7871},
    {x: 57.9454, y: 24.6562, z: 7.7871},
    {x: 61.3994, y: 24.6931, z: 7.7871},
    {x: 54.3789, y: 15.3359, z: 7.7871},
    {x: 57.9454, y: 15.3251, z: 7.7871},
    {x: 61.3994, y: 15.3621, z: 7.7871},
    {x: 54.3789, y: 7.7776, z: 7.7871},
    {x: 57.9454, y: 7.7669, z: 7.7871},
    {x: 61.3994, y: 7.8039, z: 7.7871},
    {x: 109.0001, y: 20.7459, z: 7.7871},
    {x: 116.7816, y: 20.7459, z: 7.7871},
    {x: 109.907, y: 50.7215, z: 7.7871},
    {x: 117.2357, y: 50.7215, z: 7.7871},
    {x: 109.0001, y: 72.529, z: 7.7871},
    {x: 116.7816, y: 72.529, z: 7.7871},
    {x: 109.0001, y: 64.7416, z: 7.7871},
    {x: 116.7816, y: 64.7416, z: 7.7871},
    {x: 55.7854, y: 80.7868, z: 7.7871},
    {x: 64.331, y: 80.7868, z: 7.7871},
    {x: 14.1312, y: 88.3075, z: 7.7871},
    {x: 38.1447, y: 88.3075, z: 7.7871},
    {x: 21.8083, y: 88.3075, z: 7.7871},
    {x: 30.3539, y: 88.3075, z: 7.7871},
    {x: 14.1312, y: 80.7868, z: 7.7871},
    {x: 38.1344, y: 80.3159, z: 7.7871},
    {x: 21.8083, y: 80.7868, z: 7.7871},
    {x: 30.3539, y: 80.224, z: 7.7871},
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

  lightingSet: Light[] = [];


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
        RE.Debug.log(obj2.isOpen.toString());
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
    for (let i = 0; i < this.collectableCount; i++) {
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
    RE.Debug.log("this.lightPosition.length");
    RE.Debug.log(this.lightPosition.length.toFixed());

    for (let i = 0; i < this.lightPosition.length; i++) {
      RE.Debug.log("Add Lightings");
      const lightInstance = this.light.instantiate();
      if (lightInstance) {
        this.lightingSet[i] = RE.getComponent(Light, lightInstance) as Light;
        RE.Debug.log(this.lightPosition[i].x.toPrecision() + " " + this.lightPosition[i].y.toPrecision() + " " + this.lightPosition[i].z.toPrecision())

        // this.addLight(this.lightingSet[i], this.lightPosition[i].x, this.lightPosition[i].y, this.lightPosition[i].z);
      }
    }
  }
  addLight(lightObject: Light, x: number, y: number, z: number) {
    lightObject.object3d.position.set(x, y, z);
    // RE.Debug.log(x.toString() + "," + z.toString());
    this.lightingSet.push(lightObject);
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
    botObject.object3d.position.set(x, 6, z);
    this.botSet.push(botObject);
  }

  //Bot Damage
  botDamage(obj1: RE.Component, obj2: RE.Component[], index: number) {
    const collide = CollisionDetection.colliding(obj1, obj2[index], 2);
    if (collide && !this.damageFlags[index]) {
      this.audioManager.playSFX(this.audioManager.sfx_damage);
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
    RE.Debug.log("StartGame")

    if (this.gameStarted === false) {
      this.gameLost = false;
      this.startMenuUI.hide();
      this.gameWinUI.hide();
      this.endGameUI.hide();

      this.inGameUI.show();
      RE.Debug.log("After inGameUI")

      this.inGameUI.setScore(0);
      this.inGameUI.setHealth(100);
      this.gameStarted = true;
      RE.Debug.log("gameStarted")

      const playerInstance = this.player.instantiate();
      RE.Debug.log("playerInst")

      const degreeInstance = this.degree.instantiate();
      RE.Debug.log("degreeInstance")

      const lockedDoorInstance = this.lockedDoorModel.instantiate();
      RE.Debug.log("lockedDoorInstance")

      this.showKey = false;
      this.keyCollected = false;
      this.degreeCollected = false;
      RE.Debug.log("Player Inst")
      RE.Debug.log(playerInstance.toJSON())

      if (playerInstance) {

        playerInstance.position.set(20, 0.8, -18);
        this.playerController = RE.getComponent(
          PlayerController,
          playerInstance
        ) as PlayerController;
        RE.Debug.log("Before adding stuff")
        this.addCollectables();
        this.addDoors();
        this.addBots();
        this.addLights();
        RE.Debug.log("After adding stuff")

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
    return this.collectedFlags.every((flag) => flag === true);
    // return true;
  }
}
RE.registerComponent(GameLogic);