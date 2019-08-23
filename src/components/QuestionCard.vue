<template>
  <div>
    <b-card :title="title" :sub-title="qIdLabel" class="qCard">
      <p class="card-text">
        {{ qTextLabel }}
      </p>
      <p class="card-text">
        {{ qAnswerLabel }}
      </p>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    qData: {
      type: Object,
      default: null
    },
    qTextSummary: {
      type: String,
      default: "false"
    }
  },
  data() {
    return {
      qIdLabel: "---",
      qTextLabel: "---",
      qAnswerLabel: "---"
    };
  },
  watch: {
    qData: function() {
      if (this.qData == null) {
        this.qIdLabel = "---";
        this.qTextLabel = "---";
        this.qAnswerLabel = "---";
      } else {
        this.qIdLabel = this.qData.qId.toString();
        this.qTextLabel = this.qTextSummary
          ? this.getSubstringText(this.qData.qText, 8)
          : this.getSubstringText(this.qData.qText, 50);
        this.qAnswerLabel = this.qTextSummary
          ? this.getSubstringText(this.qData.qAnswer, 8)
          : this.getSubstringText(this.qData.qAnswer, 50);
      }
    }
  },
  methods: {
    getSubstringText(target, length) {
      if (target.length > length) {
        return target.substr(0, length) + "...";
      } else {
        return target;
      }
    }
  }
};
</script>

<style scoped>
.qCard {
  height: 200px;
}
</style>
