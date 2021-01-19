import { Demo } from "./Demo";
import { GLTF } from "three-platformize/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer, AnimationAction, LoopOnce, DirectionalLight, AmbientLight } from "three-platformize";

export class DemoGLTFLoader extends Demo {
  gltf: GLTF;
  mixer: AnimationMixer;
  directionalLight: DirectionalLight;
  ambientLight: AmbientLight;

  async init(): Promise<void> {
    const gltf = await this.deps.gltfLoader.loadAsync('https://dtmall-tel.alicdn.com/edgeComputingConfig/upload_models/1591673169101/RobotExpressive.glb') as GLTF
    gltf.scene.position.z = -5
    gltf.scene.position.y = -2

    this.gltf = gltf;
    this.directionalLight = new DirectionalLight(0xffffff, 1);
    this.ambientLight = new AmbientLight(0xffffff, 1);

    this.deps.scene.add(gltf.scene);
    this.deps.scene.add(this.directionalLight);
    this.deps.scene.add(this.ambientLight);

    // init animtion
    const states = [
      "Idle",
      "Walking",
      "Running",
      "Dance",
      "Death",
      "Sitting",
      "Standing",
    ];
    const emotes = ["Jump", "Yes", "No", "Wave", "Punch", "ThumbsUp"];
    this.mixer = new AnimationMixer(gltf.scene);
    const actions: { [k: string]: AnimationAction } = {};
    for (let i = 0; i < gltf.animations.length; i++) {
      const clip = gltf.animations[i];
      const action = this.mixer.clipAction(clip);
      actions[clip.name] = action;
      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true;
        action.loop = LoopOnce;
      }
    }

    const activeAction = actions["Walking"];
    activeAction.play();
  }

  update(): void {
    this.mixer.update(this.deps.clock.getDelta())
  }

  dispose(): void {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.gltf.scene)
    this.deps.scene.remove(this.gltf.scene);
    this.deps.scene.remove(this.directionalLight);
    this.deps.scene.remove(this.ambientLight);
    this.directionalLight = null
    this.ambientLight = null
    this.mixer = null
    this.deps = null
  }
}