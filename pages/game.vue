<template>
  <div class="game">
    <div class="message">
      Click on "ESC" to show the menu
    </div>
    <div
      v-if="!gameOverStatus"
      class="game__cards"
    >
      <div
        v-for="card in gameArray"
        :key="card.id"
        class="game__item"
        :style="`width: ${cardWidth}px; height: ${cardWidth}px;`"
      >
        <!-- карточка -->
        <img
          :src="card.image"
          alt="card"
          :width="cardWidth"
          class="game__card"
          :class="{ 'game__card_hidden': !card.opened && card.closing
                      || !card.opened && !card.opening
                      || card.found && !card.destroing,
                    'game__card_opening': card.opening,
                    'game__card_closing': card.closing,
                    'game__card_destroing': card.destroing }"
        >
        <!-- рубашка -->
        <img
          :src="shirt"
          alt="card"
          :width="cardWidth"
          class="game__card"
          :class="{ 'clickable': pairOfCards.length !== 2,
                    'game__card_hidden': card.opened && !card.closing
                      || card.opened && card.opening
                      || card.found && !card.destroing,
                    'game__card_opening': card.opening,
                    'game__card_closing': card.closing,
                    'game__card_destroing': card.destroing }"
          @click="openCard(card.id)"
        >
        <!-- или пустота, если нашли пару -->
        <div
          class="game__card"
          :class="{ 'game__card_hidden': !card.found && !card.destroing }"
        />
      </div>
    </div>

    <div
      v-else
      class="gameover"
    >
      <div class="gameover__title">
        Game Over
      </div>
      <div class="gameover__text">
        Your time: {{ timeFormat }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Game',
  data() {
    return {
      cardWidth: 0,
      gameArray: [],
      cardTimer: null,
      gameTimer: null,
      time: 0,
      gameOverStatus: false,
    };
  },
  computed: {
    ...mapGetters({
      cards: 'getCards',
      lenght: 'getLenght',
      shirt: 'getShirt',
    }),

    // оставшиеся карточки
    remainingCards() {
      return this.gameArray.filter((card) => card.found === false) || [];
    },

    // пара открытых карточек
    pairOfCards() {
      return this.gameArray.filter((card) => card.opened === true);
    },

    // правильный формат времени
    timeFormat() {
      return this.$moment('1900-01-01 00:00:00').add(this.time, 'seconds').format('mm:ss');
    },
  },
  watch: {
    // смотрим пару карточек на совпадение
    pairOfCards() {
      if (this.pairOfCards.length === 2) {
        // если совпали то выключаем их и продолжаем игру
        if (this.pairOfCards[0].pair_id === this.pairOfCards[1].pair_id) {
          clearInterval(this.cardTimer);
          setTimeout(() => {
            this.pairOfCards[0].found = true;
            this.pairOfCards[1].found = true;
            this.pairOfCards[0].destroing = true;
            this.pairOfCards[1].destroing = true;
          }, 1000);
          setTimeout(() => {
            this.pairOfCards[0].destroing = false;
            this.pairOfCards[1].destroing = false;
            this.closeAllCards();
          }, 1500);
        }
      }
    },

    // смотри на оставшиеся карточки
    remainingCards() {
      // если карточек не осталось, то конец игры
      if (!this.remainingCards.length) {
        this.gameOver();
      }
    },
  },
  created() {
    this.$nuxt.$on('RESTART_GAME', this.restartGame);
    // для адаптивности
    window.addEventListener('resize', this.onResize);
  },
  mounted() {
    // для адаптивности
    this.onResize();
    // начинаем игру
    this.startGame();
  },
  beforeDestroy() {
    this.$nuxt.$off('RESTART_GAME', this.restartGame);
    // для адаптивности
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    // начало игры
    startGame() {
      // делаем копию каждой карточки
      this.gameArray = this.doCopyCards();
      // и перемешиваем их
      this.gameArray = this.doRandomize(this.gameArray);
      // включаем таймер
      this.turnOnTheTimer();
    },

    restartGame() {
      this.clearData();
      this.startGame();
    },

    gameOver() {
      this.gameOverStatus = true;
      this.turnOffTheTimer();
      // сохраняем наш результат
      this.$store.commit('setResult', this.time);
    },

    // копируем карточки и добавляем параметры для игры
    doCopyCards() {
      const cards = [];
      for (let i = 0; i < 2; i += 1) {
        this.cards.forEach((card) => {
          cards.push({
            pair_id: card.pair_id,
            image: card.image,
            opened: false, // статус открытия
            found: false, // статус отгадывания
            opening: false, // для тайминга и анимации открытия
            closing: false, // для тайминга и анимации закрытия
            destroing: false, // для тайминга и анимации нахождения копии
          });
        });
      }
      cards.forEach((card, i) => card.id = i + 1);
      return cards;
    },

    // перемешиваем карточки
    doRandomize(array) {
      let arrayCopy = array.concat();
      const newArray = [];
      for (let i = arrayCopy.length; i > 0; i -= 1) {
        const randomItem = arrayCopy[Math.floor(Math.random() * arrayCopy.length)];
        newArray.push(randomItem);
        arrayCopy = arrayCopy.filter((item) => item.id !== randomItem.id);
      }
      return newArray;
    },

    // открываем карточку
    openCard(id) {
      const card = this.gameArray.find((item) => item.id === id);
      // нельзя открыть карточку, если открытых больше 2
      if (!card.opened && this.pairOfCards.length < 2) {
        card.opened = true;
        card.closing = true;
        // 0.5с на отработку анимации
        setTimeout(() => {
          card.closing = false;
        }, 500);
        // запускаем таймер в 5 сек на закрытие карточек
        if (this.pairOfCards.length === 1) {
          this.cardTimer = setTimeout(() => {
            this.closeAllCards();
          }, 5000);
        }
      }
    },

    // закрываем карточки
    closeAllCards() {
      this.pairOfCards.forEach((card) => {
        card.opened = false;
        card.opening = true;
        // 0.5с на отработку анимации
        setTimeout(() => {
          card.opening = false;
        }, 500);
      });
    },

    turnOnTheTimer() {
      this.gameTimer = setInterval(() => {
        this.time += 1;
      }, 1000);
    },

    turnOffTheTimer() {
      clearInterval(this.gameTimer);
    },

    // очистка данных
    clearData() {
      clearInterval(this.cardTimer);
      clearInterval(this.gameTimer);
      this.gameArray = [];
      this.cardTimer = null;
      this.gameTimer = null;
      this.time = 0;
      this.gameOverStatus = false;
    },

    // ширина карточки в зависимости от параметров экрана
    onResize() {
      if (window.innerHeight > window.innerWidth) {
        this.cardWidth = (window.innerWidth - 40) / this.lenght;
      } else {
        this.cardWidth = (window.innerHeight - 40) / this.lenght;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.game {
  z-index: 5;
  position: relative;
  padding: 20px;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  &__cards {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
  }
  &__card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    transition: .5s ease-in-out;
    &_hidden {
      display: none;
    }
    &_opening {
      transform: rotateY(-90deg);
    }
    &_closing {
      transform: rotateY(90deg);
    }
    &_destroing {
      transition: .5s ease-out;
      z-index: 7;
      transform: scale(1.15);
    }
  }
  &__item {
    position: relative;
    border: 2.5px solid transparent;
    border-radius: 10px;
  }
}
.gameover {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 300px;
  transform: translateY(-400px);
  transition: 5s linear;
  &__title {
    font-size: 86px;
    line-height: 1.15;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    color: orange;
    width: fit-content;
    margin-bottom: 50px;
  }
  &__text {
    font-size: 36px;
    line-height: 1.25;
    font-weight: bold;
    width: fit-content;
  }
}
.clickable {
  cursor: pointer;
}
.message {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 150px;
  font-size: 18px;
  text-align: center;
}
</style>
