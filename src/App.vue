<template>
  <div id="app">
    <Todo items="./Todo.txt"/>
    <Temperature />
  </div>
</template>

<script>
import Temperature from './components/Temperature.vue'
import Todo from './components/Todo.vue'

export default {
  name: 'app',
  components: {
    Temperature,
    Todo
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
