declare const Swal; // sweetalert2の型定義回避

import { WORD_LIST } from './util/const'
import {
  isArray,
  arrayToRegexp,
  margeArray,
  getInputElements,
  createTitleText,
  createWarnText,
  initLibrary,
} from './util/util'

/**
 * Formの値検証用クラス.
 * @constructor
 * @param {Array<string>} 除外対象文字列の配列、値が入っていない場合は初期設定が使われます.
 */
const FormValidate = function (options) {
  initLibrary()
  isArray(options) ? this.replaceWord(options) : this.replaceWord(WORD_LIST)
}

const p = FormValidate.prototype

/**
 * ページ内のformを全て取得し、チェックイベントをセット
 */
p._setFormValidate = function () {
  const forms = document.getElementsByTagName('form')
  for (let i = 0; i < forms.length; i++) this._setSubmitEvent(forms[i])
}

/**
 * formにsubmitイベントをつける
 * @param {HTMLFormElement} form
 */
p._setSubmitEvent = function (form) {
  const self = this
  // 元から設定されているsubmitイベントがあれば一時保存
  const submitEvent = form.onsubmit || function() {}
  // 値の検証をしてから元のsubmitイベントを実行するように変更
  form.onsubmit = function (e) {
    const args = arguments
    const err = self._validateForm(form)
    if (err.length == 0) {
      // エラーがなければ元のsubmit処理を動かす
      submitEvent.apply(form, args)
    } else {
      // エラーがあれば、本当に送信するか尋ねる
      if (!!Swal) {
        // alertライブラリがあればそれを使って確認
        e.preventDefault()

        Swal.fire({
          title: createTitleText(),
          text:  createWarnText(err),
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '送信',
          cancelButtonText: 'キャンセル'
        }).then((result) => {
          if (result.value) {
            setTimeout(() => {
              submitEvent.apply(form, args)
              form.submit()
            }, 200)
          }
        })
      } else {
        // なければデフォルトのconfirm
        const errText = `${createTitleText()}\n\n${createWarnText(err)}`
        if (confirm(errText)) {
          submitEvent.apply(form, args)
        } else {
          e.preventDefault()
        }
      }
    }
  }
}

/**
 * 値の検証
 * @param  {HTMLFormElement} form
 * @return {Array}
 */
p._validateForm = function (form) {
  const err = []
  const inputs = getInputElements(form)

  // なければ終了
  if (inputs.length == 0) return err

  // 対象のタグの値を確認し、問題があればerrに追加
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]

    input.style.border = ""; // エラーだった時につけたスタイルの初期化
    if (!input.value) continue // 値がなければスルー

    const result = this.match(input.value) // 値のチェック

    // 禁止事項が含まれている要素があれば、エラー文言を作成
    if (result && result.length > 0) {
      for (let j = 0; j < result.length; j++) {
        input.style.border = "1px solid red";  // エラーがわかりやすい様に赤線追加
        err.push(result[0])
      }
    }
  }
  return margeArray([], err) // 重複を削除して返す
}

// ---------------------------------------------------------------------------

/**
 * 除外対象文字列を全て置き換える
 * @param {Array<string>}
 */
p.replaceWord = function (wordList) {
  this.wordList = wordList
  this.setRegexp()
}

/**
 * 除外対象文字列を追加する
 * @param {Array<string>|string}
 */
p.addWord = function (wordList) {
  this.wordList = margeArray(this.wordList, wordList)
  this.setRegexp()
}

/**
 * 除外対象文字列をに一致するか
 * @param {string}
 * @return {boolean}
 */
p.test = function (str) {
  return this.regexp.test(str)
}

/**
 * 除外対象文字列に一致する文言を配列で返す
 * @param {string}
 * @return {Array|null}
 */
p.match = function (str) {
  return str.match(this.regexp)
}

/**
 * 設定されている除外対象文字列をコンソールに表示
 */
p.showWord = function () {
  console.log(this.wordList)
}

/**
 * ワードを正規表現に変換
 */
p.setRegexp = function () {
  this.regexp = arrayToRegexp(this.wordList)
}

/**
 * formにチェックイベントをセットする
 */
p.init = function () {
  window.addEventListener('load', () => this._setFormValidate())
}

export default FormValidate
