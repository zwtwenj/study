<template>
    <div class="home">
        这里是home
        <button @click="toAbout">跳转</button>
    </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    toAbout () {
        this.$router.push({
            name: 'About'
        })
    }
  }
}
</script>
