"use strict";

import XlsxPopulate from "xlsx-populate";

export default class QuizDataUtil {
  static createQuizDatas(filePath, password) {
    const quizDatas = [];
    return XlsxPopulate.fromFileAsync(filePath, { password: password }).then(
      workbook => {
        // 1枚目のシートを参照する
        const sheet = workbook.sheet(0);
        let qIdCell = sheet.cell("A2");
        while (qIdCell.value() || qIdCell.value() === 0) {
          // 問題ID列に空セル(undefined)が現れるまでループ
          // undefinedはfalseを返すことを利用している（ただし、0もfalseを返してしまうので例外処理を追加）
          quizDatas.push(this.createQuizData(qIdCell));
          qIdCell = qIdCell.relativeCell(1, 0);
        }
        // サンプル問題（文字数確認用）生成
        this.createLongestQuizData(quizDatas);
        return quizDatas;
      }
    );
  }

  static createQuizData(qIdCell) {
    return {
      qId: qIdCell.value(),
      qText: this.formatImportedText(qIdCell.relativeCell(0, 1).value()),
      qAnswer: this.formatImportedText(qIdCell.relativeCell(0, 2).value()),
      qAnotherAnswer: this.formatImportedText(
        qIdCell.relativeCell(0, 3).value() ||
          qIdCell.relativeCell(0, 3).value() === 0
          ? qIdCell.relativeCell(0, 3).value()
          : ""
      )
    };
  }

  static formatImportedText(target) {
    if (Array.isArray(target)) {
      // セル内の文字の一部に書式が設定されているような場合、こちらのフローに入る
      return target
        .filter(prop => prop.name === "r")
        .map(r => r.children.filter(prop => prop.name === "t")[0].children[0])
        .join("");
    } else {
      return target;
    }
  }

  static createLongestQuizData(quizDatas) {
    const longestTextSample =
      "これはサンプル問題文・サンプル解答文です。問題ID: MAXの問題文には読み込まれた問題のうち最大字数相当の長さの文章が、解答文には読み込まれた解答のうち最大字数相当の長さの文章が自動的に設定されます。この最大字数の問題および解答がウィンドウ内で表示されるように、文字サイズや問題・解答の境界を調節してください。このサンプル問題およびサンプル解答を活用することで、表示テストを行うと同時に文字サイズや境界の調整を行いやすくなっています。投影の前にサンプル問題文およびサンプル解答を上手に活用ください。";
    let longestQTextLength = 0;
    let longestQAnswerLength = 0;
    // cf. https://github.com/eslint/eslint/issues/12117
    // eslint-disable-next-line no-unused-vars
    for (const quizData of quizDatas) {
      if (longestQTextLength < quizData.qText.length) {
        longestQTextLength = quizData.qText.length;
      }
      if (longestQAnswerLength < quizData.qAnswer.length) {
        longestQAnswerLength = quizData.qAnswer.length;
      }
    }
    // 文字数確認用サンプルは必ず問題データの先頭に追加する
    quizDatas.unshift({
      qId: "MAX",
      qText: longestTextSample.substr(0, longestQTextLength),
      qAnswer: longestTextSample.substr(0, longestQAnswerLength),
      qAnotherAnswer: ""
    });
  }

  static getQuizDataByIdx(quizDatas, index) {
    if (index < 0 || quizDatas.length <= index) {
      // インデックス外の場合はnullを返す
      return null;
    }
    return quizDatas[index];
  }

  static getQuizDatasIdxByQId(quizDatas, qId) {
    // quizDatas 内の要素から qId のみを取り出した配列を作る
    // その際 qId から '.' を取り除く
    const qIds = quizDatas.map(quizData => quizData.qId.replace(/\.?/g, ""));
    // 引数 qId とマッチした文字列のインデックスを返す
    // 見つからなければ -1 を返す
    return qIds.indexOf(qId);
  }

  static getNextIdx(quizDatas, currentIdx, isLoop) {
    if (quizDatas.length > currentIdx + 1) {
      return currentIdx + 1;
    } else {
      // ループする設定の場合は2番目の問題idxに（1番目は文字数MAX表示用）
      return isLoop ? 1 : currentIdx;
    }
  }

  static getPrevIdx(quizDatas, currentIdx, isLoop) {
    if (currentIdx - 1 >= 0) {
      return currentIdx - 1;
    } else {
      return isLoop ? quizDatas.length - 1 : currentIdx;
    }
  }
}
