<template>
  <div>
    <b-modal
      id="importQuizDataDialog"
      size="lg"
      title="問題データインポート"
      @ok="onOkClicked()"
    >
      <b-form-group label="Excelファイル" :label-cols="3">
        <b-button @click="onFileSelectBtnClicked()">
          ファイル選択
        </b-button>
        {{ filePath }}
      </b-form-group>
      <b-form-group label="パスワード" :label-cols="3">
        <b-form-input
          v-model="pass"
          type="text"
          placeholder="パスワード未設定の場合は空欄"
        />
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filePath: "",
      pass: ""
    };
  },
  methods: {
    onOkClicked() {
      if (this.file !== "") {
        this.$emit("onOkClicked", { path: this.filePath, pass: this.pass });
        this.filePath = "";
        this.pass = "";
      }
    },
    onFileSelectBtnClicked() {
      this.$electron.remote.dialog.showOpenDialog(
        this.$electron.BrowserWindow,
        filePaths => {
          this.filePath = filePaths[0] == null ? "" : filePaths[0];
        }
      );
    }
  }
};
</script>
