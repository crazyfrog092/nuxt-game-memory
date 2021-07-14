<template>
  <div class="main">
    <div class="main__welcome">
      Hello, {{ userName || 'anonym' }}
    </div>
    <div class="main__enter-name">
      <div class="main__text">
        Please enter your name
      </div>
      <input
        type="text"
        class="main__input"
        :value="userName"
        maxlength="24"
        @input="setUserName($event.target.value)"
      >
      <button
        class="main__start-btn"
        @click="$router.push('/game')"
      >
        Start
      </button>
    </div>
    <div class="main__results main__text">
      Results
      <div
        v-for="(result, i) in results"
        :key="i"
        class="main__result"
      >
        <div class="main__number">
          {{ i + 1 }}.
        </div>
        <div class="main__name">
          {{ result.name || 'anonym' }}:
        </div>
        <div class="main__time">
          {{ timeFormat(result.result) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Main',
  data() {
    return {
      name: '',
    };
  },
  computed: {
    ...mapGetters({
      results: 'getResults',
      userName: 'getUserName',
    }),
  },
  methods: {
    setUserName(value) {
      this.$store.commit('setUserName', value);
    },
    timeFormat(time) {
      return this.$moment('1900-01-01 00:00:00').add(time, 'seconds').format('mm:ss');
    },
  },
};

</script>

<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &__welcome {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 30px;
  }
  &__enter-name {
    display: flex;
    align-items: center;
    margin-bottom: 75px;
  }
  &__input {
    margin-left: 20px;
    box-shadow: none;
    outline: none;
    border: none;
    background-color: transparent;
    color: white;
    font-size: 22px;
    font-weight: bold;
    border-bottom: 2px solid orange;
    width: 200px;
    padding: 0 5px;
  }
  &__start-btn {
    font-size: 22px;
    font-weight: bold;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: darkred;
    margin-left: 20px;
    padding: 5px 20px;
    text-transform: uppercase;
    cursor: pointer;
    color: white;
    transition: .3s;
    &:hover {
      background-color: darken(darkred, 5%);
    }
  }
  &__text {
    font-size: 22px;
    font-weight: bold;
  }
  &__results {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__result {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    width: 100%;
    justify-content: flex-end;
    &:first-child {
      margin-top: 20px;
    }
  }
  &__name {
    margin-right: 20px;
    margin-left: 20px;
  }
  &__time {
    width: 75px;
    font-weight: 400;
  }
  &__number {
    margin-right: auto;
    color: orange;
  }
}
</style>
