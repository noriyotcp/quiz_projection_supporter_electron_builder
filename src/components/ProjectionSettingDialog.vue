<template>
  <div>
    <b-modal
      id="projectionSettingDialog"
      class="b-modal"
      title="投影画面設定"
      @ok="onOkClicked"
    >
      <b-form-group label="問題文フォントサイズ" :label-cols="6">
        <b-form-input v-model="qTextFontSize" type="number" />
      </b-form-group>
      <b-form-group label="解答フォントサイズ" :label-cols="6">
        <b-form-input v-model="qAnswerFontSize" type="number" />
      </b-form-group>
      <b-form-group label="別解フォントサイズ" :label-cols="6">
        <b-form-input v-model="qAnotherAnswerFontSize" type="number" />
      </b-form-group>
      <b-form-group label="投影文字色" :label-cols="6">
        <b-form-input v-model="qStringColor" type="color" />
      </b-form-group>
      <b-form-group label="投影背景色" :label-cols="6">
        <b-form-input v-model="qBackgroundColor" type="color" />
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
import JsonFileUtil from "../logic/JsonFileUtil";

export default {
  data() {
    return {
      qTextFontSize: 50,
      qAnswerFontSize: 40,
      qAnotherAnswerFontSize: 40,
      qStringColor: "#000000",
      qBackgroundColor: "#ffffff"
    };
  },
  watch: {
    qTextFontSize: function() {
      this.onSizeChanged();
    },
    qAnswerFontSize: function() {
      this.onSizeChanged();
    },
    qAnotherAnswerFontSize: function() {
      this.onSizeChanged();
    },
    qStringColor: function() {
      this.onColorChanged();
    },
    qBackgroundColor: function() {
      this.onColorChanged();
    }
  },
  created: function() {
    this.loadSetting();
  },
  mounted: function() {
    // eslint-disable-next-line no-unused-vars
    this.$root.$on("bv::modal::hide", (bvEvent, modalId) => {
      // 「OK」ボタン押下以外の操作をした場合、その時点の設定をロードしてリセットする
      if (bvEvent.trigger !== "ok") {
        this.loadSetting();
        // console.log("Modal is not OK", bvEvent, modalId);
      }
    });
  },
  methods: {
    onSizeChanged() {
      this.$emit("on-size-changed", {
        qTextFontSize: this.qTextFontSize,
        qAnswerFontSize: this.qAnswerFontSize,
        qAnotherAnswerFontSize: this.qAnotherAnswerFontSize
      });
    },
    onColorChanged() {
      this.$emit("on-color-changed", {
        qStringColor: this.qStringColor,
        qBackgroundColor: this.qBackgroundColor
      });
    },
    onOkClicked() {
      this.saveSetting();
    },
    saveSetting() {
      JsonFileUtil.saveFile("pjSetting", {
        qTextFontSize: parseInt(this.qTextFontSize),
        qAnswerFontSize: parseInt(this.qAnswerFontSize),
        qAnotherAnswerFontSize: parseInt(this.qAnotherAnswerFontSize),
        qStringColor: this.qStringColor,
        qBackgroundColor: this.qBackgroundColor
      });
    },
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
          if (err.code === "ENOENT") {
            this.saveSetting();
            console.info("Save settings");
          }
        });
    }
  }
};
</script>
