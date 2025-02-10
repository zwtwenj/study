<template>
    <div>
        {{ title }}
    </div>
</template>

<script>
import { ref } from 'vue'
export default {
    setup(){
        const state = ref(0)
        const title = ref('hello world')
        return {
            state,
            title
        }
    }
}
</script>