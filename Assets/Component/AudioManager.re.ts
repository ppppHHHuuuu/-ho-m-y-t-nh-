import * as RE from "rogue-engine";
import * as THREE from "three";

export default class AudioManager extends RE.Component {
  @RE.props.audio(true) backgroundSong: THREE.Audio;
  @RE.props.audio(true) breathing: THREE.Audio;
  @RE.props.audio(true) heartbeat: THREE.Audio;
  @RE.props.audio(true) ambience: THREE.Audio;
  @RE.props.audio(true) sfx_collect: THREE.Audio;
  @RE.props.audio(true) sfx_door: THREE.Audio;
  @RE.props.audio(true) sfx_locked_door: THREE.Audio;
  @RE.props.audio(true) sfx_damage: THREE.Audio;
  @RE.props.audio(true) sfx_key: THREE.Audio;
  @RE.props.audio(true) sfx_unlock_door: THREE.Audio;

  awake() {
    if (this.backgroundSong) {
      this.object3d.add(this.backgroundSong);
      this.object3d.add(this.breathing);
      this.object3d.add(this.heartbeat);
      this.object3d.add(this.ambience);
      this.backgroundSong.setVolume(7);
      this.backgroundSong.setLoop(true);
      this.backgroundSong.play();
      this.breathing.setVolume(20);
      this.breathing.setLoop(true);
      this.breathing.play();
      this.heartbeat.setVolume(15);
      this.heartbeat.setLoop(true);
      this.heartbeat.play();
      this.ambience.setVolume(15);
      this.ambience.setLoop(true);
      this.ambience.play();
    }
  }

  public playSFX(sfx: THREE.Audio) {
    sfx.setVolume(30);
    sfx.play();
  }
}

RE.registerComponent(AudioManager);
