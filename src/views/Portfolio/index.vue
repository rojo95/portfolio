<script>
import { ref, onMounted } from "vue";
import {CharacterController} from "babylonjs-charactercontroller";

import { createScene } from "../../scenes/MyFirstScene";

export default {
  name: "BabylonScene",
  setup() {
    const bjsCanvas = ref(null);

    onMounted(async() => {
      if (bjsCanvas.value) {
        await createScene(bjsCanvas.value);
      }
    });

    return {
      bjsCanvas,
    };
  },
};
</script>

<template>
  <canvas ref="bjsCanvas" style="width: 100%" />
</template>
