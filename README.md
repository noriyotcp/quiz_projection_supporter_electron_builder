# Quiz Projection Supporter (w/ Electron Builder)

## これは
技術書典6で頒布された『[実践で学ぶ！Electron+Vue.jsでデスクトップアプリ開発](https://booth.pm/ja/items/1317888)』の電子書籍版を元に作成したアプリです

詳しくはこちらのリポジトリをご覧ください
https://github.com/nano-nano/quiz_projection_supporter

問題文や解答を表示させるには、指定フォーマットの Excel ファイルが必要です。このリポジトリには含めていません

詳しくは上記リポジトリの `quiz_sample_from_STU.xlsx` をご覧ください

---

[Quiz Projection Supporter](https://github.com/noriyotcp/quiz_projection_supporter) は Vue.js + [electron-vue](https://github.com/SimulatedGREG/electron-vue) で作成しましたが、このプロジェクトは Vue.js + [vue-cli-plugin-electron-builder](https://github.com/nklayman/vue-cli-plugin-electron-builder) で作成しました

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn electron:serve
```

### Compiles and minifies for production
```
yarn electron:build
```

### Lints and fixes files
```
yarn lint
```

### Run your unit tests
```
yarn test:unit
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
