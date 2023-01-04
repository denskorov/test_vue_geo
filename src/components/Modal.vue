<template>
  <div class="modal" v-if="isOpen">
    <div class="window">
      <div>
        <slot />
      </div>
      <div>
        <button @click="confirm" class="btn btn-success mr-2">Зберегти</button>
        <button @click="close" class="btn">Закрити</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalWindow",
  data: () => ({
    isOpen: false,
    resolve: null,
    reject: null,
  }),
  methods: {
    open(cb) {
      this.isOpen = true;
      cb();
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    close() {
      this.reject();
      this.isOpen = false;
    },
    confirm() {
      this.resolve();
      this.isOpen = false;
    },
  },
};
</script>

<style scoped lang="scss">
.modal {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.44);
  z-index: 1000;
}

.window {
  max-width: 600px;
  background-color: #fff;
  padding: 15px 20px;
}
</style>
