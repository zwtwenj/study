<template>
    <el-dialog title="复制配置">
        <div>
            图元文件：
            <div v-for="item in copyConfig.svgUse" :key="item">
                {{ item }}
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const props = withDefaults(defineProps<{
    copyConfig: any,
}>(), {
    copyConfig: {},
})
</script>