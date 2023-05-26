<template>
    <div class="editor-material-item"
        draggable="true"
        @dragstart="dragStartHandle($event, componentItem)"
        @dragend="dragendHandle"
        @dblclick="dblclickHandle(componentItem)">
        <img class="component-item-img" :src="componentItem.img">
        <div class="component-item-name">{{ componentItem.title }}</div>
    </div>
</template>

<script setup>
const props = defineProps({
    componentItem: {
        type: Object,
        default: () => {}
    }
})

const dragStartHandle = (e, data) => {
    
}

// export default {
//     // props: {
//     //     componentItem: Object
//     // },
//     methods: {
//         dragStartHandle (e, data) {
//             console.log(e)
//         },
//         dragendHandle () {
            
//         },
//         dblclickHandle () {}
//     }
// }
</script>

<style lang="scss" scoped>
.editor-material-item{
    text-align: center;
    margin-bottom: 5px;
    .component-item-img{
        width: 180px;
        height: 100px;
    }
}
</style>