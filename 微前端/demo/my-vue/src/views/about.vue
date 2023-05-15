<template>
    <div>
        这里是about
        <img :src="img">
        dqwdq
        <button @click="toAbout">跳转</button>
    </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
        img: require('./result.png')
    }
  },
  methods: {
    toAbout () {
        this.$router.push({
            name: 'Home'
        })
    }
  }
}
</script>