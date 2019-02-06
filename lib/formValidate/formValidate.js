(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.FormValidate = factory());
}(this, function () { 'use strict';

  /**
   * デフォルトの禁止文字
   */
  var WORD_LIST = [
      'test',
      'admin',
  ];
  /**
   * 検索対象Element
   */
  var TAG_LIST = [
      'input[type="text"]',
      'input[type="radio"]:checked',
      'input[type="checkbox"]:checked',
      'textarea',
      'select'
  ];

  /**
   * 配列として扱える場合true
   * @param {Array} list
   * @return {boolean}
   */
  function isArray(list) {
      return Array.isArray(list) && list.length > 0;
  }
  /**
   * 配列の中身を正規表現に変換
   * @param {Array} list
   * @return {regexp}
   */
  function arrayToRegexp(list) {
      return new RegExp(list.join('|'), 'i');
  }
  /**
   * beforeとafterを結合して、重複を削除した配列を返す
   * @param {Array} before
   * @param {Array} after
   * @return {Array}
   */
  function margeArray(before, after) {
      return before.concat(after).filter(function (x, i, self) { return self.indexOf(x) === i; });
  }
  /**
   * form配下のinputを取得
   * @param  {HTMLFormElement} form
   * @return {NodeList}
   */
  function getInputElements(form) {
      var selectorText = '';
      for (var i = 0; i < TAG_LIST.length; i++) {
          if (i > 0) {
              selectorText += ', ';
          }
          selectorText += TAG_LIST[i];
      }
      return form.querySelectorAll(selectorText);
  }
  /**
   * 注意文章のタイトルを作成
   * @return {string}
   */
  function createTitleText() {
      return '本当に投稿しますか？';
  }
  /**
   * 注意文言の作成
   * @param  {Array} err
   * @return {string}
   */
  function createWarnText(err) {
      var tmp = '投稿文章に';
      for (var i = 0; i < err.length; i++) {
          tmp += '「' + err[i] + '」';
      }
      return tmp + 'が含まれています。';
  }
  /**
   * alertのライブラリを読み込む
   */
  function initLibrary() {
      // モーダル用
      var elSweetalert = document.createElement('script');
      elSweetalert.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@8';
      document.head.appendChild(elSweetalert);
      // promise用
      var elPromise = document.createElement('script');
      elPromise.src = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js';
      document.head.appendChild(elPromise);
  }

  /**
   * Formの値検証用クラス.
   * @constructor
   * @param {Array<string>} 除外対象文字列の配列、値が入っていない場合は初期設定が使われます.
   */
  var FormValidate = function (options) {
      initLibrary();
      isArray(options) ? this.replaceWord(options) : this.replaceWord(WORD_LIST);
  };
  var p = FormValidate.prototype;
  /**
   * ページ内のformを全て取得し、チェックイベントをセット
   */
  p._setFormValidate = function () {
      var forms = document.getElementsByTagName('form');
      for (var i = 0; i < forms.length; i++)
          this._setSubmitEvent(forms[i]);
  };
  /**
   * formにsubmitイベントをつける
   * @param {HTMLFormElement} form
   */
  p._setSubmitEvent = function (form) {
      var self = this;
      // 元から設定されているsubmitイベントがあれば一時保存
      var submitEvent = form.onsubmit || function () { };
      // 値の検証をしてから元のsubmitイベントを実行するように変更
      form.onsubmit = function (e) {
          var args = arguments;
          var err = self._validateForm(form);
          if (err.length == 0) {
              // エラーがなければ元のsubmit処理を動かす
              submitEvent.apply(form, args);
          }
          else {
              // エラーがあれば、本当に送信するか尋ねる
              if (!!Swal) {
                  // alertライブラリがあればそれを使って確認
                  e.preventDefault();
                  Swal.fire({
                      title: createTitleText(),
                      text: createWarnText(err),
                      type: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: '送信',
                      cancelButtonText: 'キャンセル'
                  }).then(function (result) {
                      if (result.value) {
                          setTimeout(function () {
                              submitEvent.apply(form, args);
                              form.submit();
                          }, 200);
                      }
                  });
              }
              else {
                  // なければデフォルトのconfirm
                  var errText = createTitleText() + "\n\n" + createWarnText(err);
                  if (confirm(errText)) {
                      submitEvent.apply(form, args);
                  }
                  else {
                      e.preventDefault();
                  }
              }
          }
      };
  };
  /**
   * 値の検証
   * @param  {HTMLFormElement} form
   * @return {Array}
   */
  p._validateForm = function (form) {
      var err = [];
      var inputs = getInputElements(form);
      // なければ終了
      if (inputs.length == 0)
          return err;
      // 対象のタグの値を確認し、問題があればerrに追加
      for (var i = 0; i < inputs.length; i++) {
          var input = inputs[i];
          input.style.border = ""; // エラーだった時につけたスタイルの初期化
          if (!input.value)
              continue; // 値がなければスルー
          var result = this.match(input.value); // 値のチェック
          // 禁止事項が含まれている要素があれば、エラー文言を作成
          if (result && result.length > 0) {
              for (var j = 0; j < result.length; j++) {
                  input.style.border = "1px solid red"; // エラーがわかりやすい様に赤線追加
                  err.push(result[0]);
              }
          }
      }
      return margeArray([], err); // 重複を削除して返す
  };
  // ---------------------------------------------------------------------------
  /**
   * 除外対象文字列を全て置き換える
   * @param {Array<string>}
   */
  p.replaceWord = function (wordList) {
      this.wordList = wordList;
      this.setRegexp();
  };
  /**
   * 除外対象文字列を追加する
   * @param {Array<string>|string}
   */
  p.addWord = function (wordList) {
      this.wordList = margeArray(this.wordList, wordList);
      this.setRegexp();
  };
  /**
   * 除外対象文字列をに一致するか
   * @param {string}
   * @return {boolean}
   */
  p.test = function (str) {
      return this.regexp.test(str);
  };
  /**
   * 除外対象文字列に一致する文言を配列で返す
   * @param {string}
   * @return {Array|null}
   */
  p.match = function (str) {
      return str.match(this.regexp);
  };
  /**
   * 設定されている除外対象文字列をコンソールに表示
   */
  p.showWord = function () {
      console.log(this.wordList);
  };
  /**
   * ワードを正規表現に変換
   */
  p.setRegexp = function () {
      this.regexp = arrayToRegexp(this.wordList);
  };
  /**
   * formにチェックイベントをセットする
   */
  p.init = function () {
      var _this = this;
      window.addEventListener('load', function () { return _this._setFormValidate(); });
  };

  return FormValidate;

}));
