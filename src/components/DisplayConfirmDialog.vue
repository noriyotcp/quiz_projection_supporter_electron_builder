<template>
  <div>
    <b-modal id="displayConfirmDialog" class="b-modal" @ok="onOkClicked()">
      <p>次の問題が表示されます。よろしいですか？</p>
      <p>{{ quizData.qText }}</p>
      <p>{{ quizData.qAnswer }}</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    qData: {
      type: Object,
      required: true
    }
  },
  computed: {
    quizData: function() {
      return this.qData == null ? { qText: "", qAnswer: "" } : this.qData;
    }
  },
  methods: {
    onOkClicked() {
      this.$emit("onOkClicked");
    }
  }
};
</script>
