<template>
    <div class="m-button" :style="style">
        按钮
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
const props = defineProps({
  style: {
    type: Object,
    default: () => {}
  }
})
onMounted(() => {
    console.log(props.style)
    console.log('11111')
})
</script>

<style lang="scss" scoped>
.m-button{
    padding: 5px;
    display: inline-block;
    background-color: gray;
    border-radius: 5px;
    cursor: pointer;
    position: absolute;
}
</style>

