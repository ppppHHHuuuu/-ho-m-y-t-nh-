import * as RE from "rogue-engine";

export default class UIComponent extends RE.Component {
  @RE.props.text() url = "";
  container = document.createElement("div");
  isShowing: boolean;
  async awake() {
    this.container.style.display = "none";

    const filePath = RE.getStaticPath(this.url);
    const res = await fetch(filePath);

    this.container.innerHTML = await res.text();
    RE.Runtime.uiContainer.append(this.container);
  }

  show(...args: any[]) {
    if (!this.isShowing) {
      this.container.style.display = "block";
      this.isShowing = true;
    }
  }

  hide(...args: any[]) {
    if (this.isShowing) {
      this.container.style.display = "none";
      this.isShowing = false;
    }
  }

  start() {}

  update() {}
}

RE.registerComponent(UIComponent);
