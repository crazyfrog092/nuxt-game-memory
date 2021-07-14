<template>
  <!-- открывается по нажатию на ESC -->
  <div class="menu">
    <div class="menu__wrap">
      <div class="menu__box">
        <button
          class="menu__item"
          @click="restart()"
        >
          Restart
        </button>
        <button
          class="menu__item"
          disabled
        >
          Settings
        </button>
        <button
          class="menu__item"
          @click="exit()"
        >
          Exit
        </button>
        <button
          class="menu__item"
          @click="closeMenu()"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  methods: {
    exit() {
      this.$router.push('/');
      this.$emit('closeMenu');
    },
    closeMenu() {
      this.$emit('closeMenu');
    },
    restart() {
      this.$nuxt.$emit('RESTART_GAME');
      this.closeMenu();
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  z-index: 10;
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(#080808, 0.7);
  &__wrap {
    padding: 10px;
    max-width: 400px;
    width: 100%;
  }
  &__box {
    width: 100%;
    background-color: #080808;
    padding: 25px 15px;
    display: grid;
    gap: 50px;
    border-radius: 12px;
  }
  &__item {
    font-size: 24px;
    font-weight: bold;
    width: 100%;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: darkred;
    cursor: pointer;
    color: white;
    transition: .3s;
    &:hover {
      background-color: darken(darkred, 5%);
    }
    &:disabled {
      transition: none;
      background-color: darken(grey, 15%);
      cursor: default;
    }
  }
}
</style>
