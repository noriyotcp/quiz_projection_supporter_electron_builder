<template>
  <div>
    <!-- Navigation Bar -->
    <div class="container-flued">
      <b-navbar toggleable="md" type="dark" variant="secondary">
        <b-navbar-nav>
          <b-nav-item href="#" @click="onClickProjectionScreenLink">
            投影画面を{{ pjWindow == null ? "開く" : "閉じる" }}
          </b-nav-item>
          <b-nav-item-dropdown text="設定">
            <b-dropdown-item v-b-modal.importQuizDataDialog href="#">
              問題データを読み込む
            </b-dropdown-item>
            <b-dropdown-item v-b-modal.projectionSettingDialog href="#">
              投影画面設定
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-navbar>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col-8">
          <question-card title="現在表示中" :q-data="displayedQuizData" />
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="toUpTriangle">
          ▲▲▲
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-3">
          <question-card
            title="ひとつ前"
            q-text-summary="true"
            :q-data="prevQuezData"
          />
        </div>

        <div class="col-6 align-self-center">
          <question-card title="表示候補" :q-data="candidateQuizData" />
        </div>

        <div class="col-3">
          <question-card
            title="ひとつ次"
            q-text-summary="true"
            :q-data="nextQuizData"
          />
        </div>
      </div>

      <div class="row justify-content-center buttonArea">
        <div class="col-3">
          <b-button
            size="lg"
            variant="outline-secondary"
            block
            @click="onClickPrevBtn()"
          >
            ＜＜ 前
          </b-button>
        </div>

        <div class="col-6">
          <p>
            <b-button
              v-b-modal.displayConfirmDialog
              size="lg"
              variant="primary"
              block
              :disabled="candidateQuizData == null"
            >
              投影画面へ表示
            </b-button>
          </p>
          <p class="text-center">
            <b-button
              size="lg"
              variant="outline-secondary"
              @click="onClickDisableQuestionBtn()"
            >
              投影画面の表示を消す
            </b-button>
            <b-button
              v-b-modal.selectQuestionIdDialog
              size="lg"
              variant="outline-secondary"
            >
              問題IDで選択
            </b-button>
          </p>
          <div class="form-inline">
            <b-form-checkbox v-model="isDisplayAnotherAnswers" size="lg">
              別解を表示
            </b-form-checkbox>
            <b-form-checkbox v-model="isDisplayQId" size="lg">
              問題IDを表示
            </b-form-checkbox>
            <b-form-checkbox
              v-model="isLoopSelection"
              v-b-tooltip.hover
              size="lg"
              title="最初と最後の問題の間を[<<前][次>>]ボタンで行き来できるようにします"
            >
              問題選択をループする
            </b-form-checkbox>
          </div>
        </div>

        <div class="col-3">
          <b-button
            size="lg"
            variant="outline-secondary"
            block
            @click="onClickNextBtn()"
          >
            次 ＞＞
          </b-button>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- QuestionID選択ダイアログ -->
      <select-question-id-dialog @onOkClicked="onSelectQuestionIdDialogOk" />
      <!-- 投影確認ダイアログ -->
      <display-confirm-dialog
        :q-data="candidateQuizData"
        @onOkClicked="onDisplayConfirmDialogOk"
      />
      <!-- 問題ファイルインポートダイアログ -->
      <import-quiz-data-dialog @onOkClicked="onImportQuizDialogOk" />
      <!-- 投影画面設定ダイアログ -->
      <projection-setting-dialog
        @onSizeChanged="onPjSettingDialogFontSizeChange"
        @onColorChanged="onPjSettingDialogColorChange"
      />
      <!-- メッセージ通知ダイアログ -->
      <notification-dialog
        ref="notificationDialogComponent"
        :message="dialogMsg"
        @onOkClicked="onNotificationDialogOk"
      />
    </div>
  </div>
</template>

<script>
import QuestionCard from "../components/QuestionCard";
import SelectQuestionIdDialog from "../components/SelectQuestionIdDialog";
import DisplayConfirmDialog from "../components/DisplayConfirmDialog";
import ImportQuizDataDialog from "../components/ImportQuizDataDialog";
import ProjectionSettingDialog from "../components/ProjectionSettingDialog";
import NotificationDialog from "../components/NotificationDialog";

import WindowUtil from "../logic/WindowUtil";
import QuizDataUtil from "../logic/QuizDataUtil";

export default {
  name: "MainScreen",
  components: {
    QuestionCard,
    ImportQuizDataDialog,
    NotificationDialog,
    DisplayConfirmDialog,
    SelectQuestionIdDialog,
    ProjectionSettingDialog
  },
  data() {
    return {
      pjWindow: null,
      quizDatas: null,
      currentQuizDataIdx: 0,
      displayedQuizData: {},
      candidateQuizData: {},
      nextQuizData: {},
      prevQuezData: {},
      isDisplayAnotherAnswers: false,
      isDisplayQId: false,
      isLoopSelection: false,
      dialogMsg: ""
    };
  },
  watch: {
    isDisplayAnotherAnswers: function() {
      this.sendMessageToPjWindow(
        "isDisplayAnotherAnswers",
        this.isDisplayAnotherAnswers
      );
    },
    isDisplayQId: function() {
      this.sendMessageToPjWindow("isDisplayQId", this.isDisplayQId);
    }
  },
  methods: {
    onClickProjectionScreenLink() {
      if (this.pjWindow == null) {
        const targetHref = this.$router.resolve("projection").href;
        const option = {
          width: 1280,
          height: 720,
          autoHideMenuBar: true
        };
        this.pjWindow = WindowUtil.openWindow(targetHref, option);
        this.pjWindow.on("closed", () => {
          // When close the window, set null to this.pjWindow
          this.pjWindow = null;
        });
      } else {
        // If the window is open when clicking a link, close the window
        this.pjWindow.close();
        this.pjWindow = null;
      }
    },
    onClickDisableQuestionBtn() {
      this.displayedQuizData = null;
      this.sendMessageToPjWindow("displayQuizData", this.displayedQuizData);
    },
    onClickNextBtn() {
      this.currentQuizDataIdx = QuizDataUtil.getNextIdx(
        this.quizDatas,
        this.currentQuizDataIdx,
        this.isLoopSelection
      );
      this.updateQuizSelectCards();
    },
    onClickPrevBtn() {
      this.currentQuizDataIdx = QuizDataUtil.getPrevIdx(
        this.quizDatas,
        this.currentQuizDataIdx,
        this.isLoopSelection
      );
      this.updateQuizSelectCards();
    },
    updateQuizSelectCards() {
      this.candidateQuizData = QuizDataUtil.getQuizDataByIdx(
        this.quizDatas,
        this.currentQuizDataIdx
      );
      this.nextQuizData = QuizDataUtil.getQuizDataByIdx(
        this.quizDatas,
        this.currentQuizDataIdx + 1
      );
      this.prevQuezData = QuizDataUtil.getQuizDataByIdx(
        this.quizDatas,
        this.currentQuizDataIdx - 1
      );
    },
    showNotificationDialog(message) {
      this.dialogMsg = message;
      // NotificationDialog 内の Modal component を参照している
      this.$refs.notificationDialogComponent.$refs.modal.show();
    },
    onNotificationDialogOk() {
      // ダイアログ表示用メッセージ変数をリセットしておく
      this.dialogMsg = "";
    },
    onDisplayConfirmDialogOk() {
      this.displayedQuizData = this.candidateQuizData;
      this.sendMessageToPjWindow("displayQuizData", this.displayedQuizData);
    },
    onSelectQuestionIdDialogOk(newQId) {
      const idx = QuizDataUtil.getQuizDatasIdxByQId(this.quizDatas, newQId);
      if (idx !== -1) {
        this.currentQuizDataIdx = idx;
        this.updateQuizSelectCards();
      }
    },
    onImportQuizDialogOk(res) {
      QuizDataUtil.createQuizDatas(res.path, res.pass)
        .then(quizDatas => {
          this.quizDatas = quizDatas;
          this.currentQuizDataIdx = 0;
          this.updateQuizSelectCards();
          this.showNotificationDialog("インポートが完了しました");
        })
        .catch(error => {
          console.error(error);
          this.showNotificationDialog("インポートに失敗しました");
        });
    },
    onPjSettingDialogFontSizeChange(res) {
      this.sendMessageToPjWindow("fontSizeChange", res);
    },
    onPjSettingDialogColorChange(res) {
      this.sendMessageToPjWindow("colorChange", res);
    },
    sendMessageToPjWindow(channel, arg) {
      if (this.pjWindow != null) {
        this.pjWindow.webContents.send(channel, arg);
      }
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style>
.toUpTriangle {
  font-size: 200%;
}
.buttonArea {
  margin-top: 20px;
}
</style>
