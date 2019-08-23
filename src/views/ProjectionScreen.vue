<template>
  <div class="pjBase">
    <div class="container-flued">
      <b-card class="qTextCard" :style="{ backgroundColor: qBackgroundColor }">
        <p
          class="card-text"
          :style="{ fontSize: qTextFontSize + 'px', color: qStringColor }"
        >
          {{ isDisplayQId && qId !== "" ? `【${qId}】` : "" }}{{ qText }}
        </p>
      </b-card>

      <div class="qAnswerArea">
        <b-card
          :class="[
            isDisplayAnotherAnswers
              ? 'qAnswerCard-AnotherAnswer'
              : 'qAnswerCard-WoAnotherAnswer'
          ]"
          :style="{ backgroundColor: qBackgroundColor }"
        >
          <p
            class="card-text"
            :style="{ fontSize: qAnswerFontSize + 'px', color: qStringColor }"
          >
            {{ qAnswer }}
          </p>
        </b-card>

        <b-card
          v-if="isDisplayAnotherAnswers"
          class="qAnotherAnswerCard"
          :style="{ backgroundColor: qBackgroundColor }"
        >
          <p
            class="card-text"
            :style="{
              fontSize: qAnotherAnswerFontSize + 'px',
              color: qStringColor
            }"
          >
            {{ qAnotherAnswer }}
          </p>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import JsonFileUtil from "../logic/JsonFileUtil";

export default {
  data() {
    return {
      qId: "",
      qText: "",
      qAnswer: "",
      qAnotherAnswer: "",
      isDisplayAnotherAnswers: false,
      isDisplayQId: false,
      qTextFontSize: 50,
      qAnswerFontSize: 40,
      qAnotherAnswerFontSize: 40,
      qStringColor: "#000000",
      qBackgroundColor: "#ffffff"
    };
  },
  created: function() {
    this.loadSetting();
  },
  mounted: function() {
    const ipc = this.$electron.ipcRenderer;
    ipc.on("displayQuizData", (event, arg) => {
      if (arg != null) {
        this.qId = arg.qId;
        this.qText = arg.qText;
        this.qAnswer = arg.qAnswer;
        this.qAnotherAnswer = arg.qAnotherAnswer;
      } else {
        this.qId = "";
        this.qText = "";
        this.qAnswer = "";
        this.qAnotherAnswer = "";
      }
    });
    ipc.on("isDisplayAnotherAnswers", (event, arg) => {
      this.isDisplayAnotherAnswers = arg;
    });
    ipc.on("isDisplayQId", (event, arg) => {
      this.isDisplayQId = arg;
    });
    ipc.on("fontSizeChange", (event, arg) => {
      this.qTextFontSize = arg.qTextFontSize;
      this.qAnswerFontSize = arg.qAnswerFontSize;
      this.qAnotherAnswerFontSize = arg.qAnotherAnswerFontSize;
    });
    ipc.on("colorChange", (event, arg) => {
      this.qStringColor = arg.qStringColor;
      this.qBackgroundColor = arg.qBackgroundColor;
    });
  },
  methods: {
    loadSetting() {
      JsonFileUtil.loadFile("pjSetting")
        .then(data => {
          if (data !== null) {
            this.qTextFontSize = data.qTextFontSize;
            this.qAnswerFontSize = data.qAnswerFontSize;
            this.qAnotherAnswerFontSize = data.qAnotherAnswerFontSize;
            this.qStringColor = data.qStringColor;
            this.qBackgroundColor = data.qBackgroundColor;
          }
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

<style scoped>
/* 全画面表示するために高さを100%にする */
html,
body,
div#app {
  height: 100%;
  margin: 0;
}

.pjBase {
  background-color: black;
  height: 100vh;
  margin: 0;
}

.container-flued {
  height: 100vh;
  padding: 3vh;
}

.qTextCard {
  height: 64%;
}

.qAnswerArea {
  height: 35%;
  margin-top: 1%;
}

.qAnswerCard-AnotherAnswer {
  height: 50%;
}
.qAnswerCard-WoAnotherAnswer {
  height: 100%;
}

.qAnotherAnswerCard {
  height: 50%;
}

.card-body {
  padding: 10px;
}
</style>
