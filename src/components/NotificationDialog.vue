<template>
  <div>
    <b-modal ref="modal" hide-header ok-only>
      <p>{{ message }}</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    }
  },
  onOkClicked() {
    // eslint-disable-next-line
    this.$emit("onOkClicked");
  }
};
</script>
