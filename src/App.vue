<template>
  <nav>
    <router-link :to="{ name: 'home' }">Головна</router-link> |
    <router-link :to="{ name: 'map' }">Мапа</router-link>
  </nav>
  <hr />
  <router-view />
</template>

<style lang="scss">
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #345ee7;
    }
  }
}
</style>
