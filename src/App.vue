<template>
  <!-- <TestDraggable></TestDraggable> -->
  <div class="tesllll">

  </div>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { WaterMark } from "./WaterMark.ts";

onMounted(()=>{
  WaterMark.createWaterMark({
    content: ['ibiznameadm', 'ibiznameadmi', 'ibiznameadmi', 'ibiznameadmi'],
    target: '.tesllll',
  });
})
</script>

<style>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.tesllll {
  width: 100vw;
  height: 100vh;
}
</style>
