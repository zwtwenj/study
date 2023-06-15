<template>
    <div class="editor-component-list">
        <component :is="item.componentData" v-for="(item, index) in list" :key="index" :style="item.style"></component>
    </div>
</template>

<script setup>
// import mButton from '../../material/mButton/mButton.vue'
// import mButton from '@/material/mButton/mButton.vue'
import { defineAsyncComponent, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const list = computed(() => {
    return store.state.componentList.map(item => {
        return {
            ...item,
            componentData: defineAsyncComponent(() => {
                return import(`../../${item.url}`)
            })
        }
    })
})
</script>