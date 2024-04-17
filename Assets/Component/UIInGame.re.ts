import * as RE from "rogue-engine";
import UIComponent from "./UIComponent.re";

export default class UIInGame extends UIComponent {
  scoreDiv: HTMLDivElement;
  healthDiv: HTMLDivElement;
  healthText: HTMLDivElement;

  show() {
    super.show();
    this.scoreDiv = document.getElementById("score") as HTMLDivElement;
    this.healthDiv = document.getElementById("health-fill") as HTMLDivElement;
    this.healthText = document.getElementById("health-bar-circle") as HTMLDivElement;
  }

  setScore(score: number) {
    this.scoreDiv.innerHTML = score.toString();
  }

  setHealth(health: number) {
    this.healthDiv.style.width = `${health.toString()}%`;
  }

  setHealthText(health: number) {
    this.healthText.innerHTML = health.toString();
  }
}

RE.registerComponent(UIInGame);