import * as RE from "rogue-engine";
import UIComponent from "./UIComponent.re";

export default class UIWin extends UIComponent {
    maxScoreDiv: HTMLDivElement;
    show() {
        super.show();
        this.maxScoreDiv = document.getElementById("maxScore") as HTMLDivElement;
    }

    setFinalScore(score: number) {
        this.maxScoreDiv.innerHTML = score.toString();

    }

}

RE.registerComponent(UIWin);