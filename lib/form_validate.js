/**
 * formのvalidate処理
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.FormValidate = factory())
}(this, function () {
	
	'use strict'

  var defaultOptions = {
    wordList: [
			`test`,
			`admin`,
		],
    tagList: [
			'input[type="text"]',
			'input[type="radio"]:checked',
			'input[type="checkbox"]:checked',
			'textarea',
			'select'
		],
  }

  /**
   * 配列として扱える場合true
   * @param {Array} list 
   * @return {boolean}
   */
  function isArray (list) {
    return Array.isArray(list) && list.length > 0
  }

  /**
   * 配列の中身を正規表現に変換
   * @param {Array} list 
   */
  function arrayToRegexp (list) {
    return new RegExp(list.join('|'), 'i')
  }

  /**
   * form配下のinputを取得
   * @param  {HTMLFormElement} form
   * @return {NodeList}
   */
  function getInputElements (form) {
    var selectorText = ''
    for (var i = 0; i < defaultOptions.tagList.length; i++) {
      if (i > 0) selectorText += ', '
      selectorText += defaultOptions.tagList[i]
    }
    return form.querySelectorAll(selectorText)
  }

  /**
   * エラー文言の作成
   * @param  {String} target
   * @param  {String} words
   * @return {String}
   */
  function createErrText(target, words) {
    return '[warn] ' + target + ' に "' + (words.toString().replace(/,/g, '", "')) + '" が含まれています'
  }

  /**
   * 注意文言の作成
   * @param  {Array} err
   * @return {String}
   */
  function createWarnText(err) {
    var tmp = '送信するべきではない値が含まれている可能性があります。\n本当に送信してもよろしいでしょうか？\n\n'
    for (var i = 0; i < err.length; i++) {
      tmp += err[i] + '\n'
    }
    return tmp
  }

  // ---------------------------------------------------------------------------
  var FormValidate, p

  /**
   * Formの値検証用クラス.
   * @constructor
   * @param {Array<string>} 除外対象文字列の配列、値が入っていない場合は初期設定が使われます.
   */
  FormValidate = function (options) {
    isArray(options) ? this.replaceWord(options) : this.replaceWord(defaultOptions.wordList)
  }

  p = FormValidate.prototype

  /**
   * ページ内のformを全て取得し、チェックイベントをセット
   */
  p._setFormValidate = function () {
    var forms = document.getElementsByTagName('form')
    for (var i = 0; i < forms.length; i++) {
      this._setSubmitEvent(forms[i])
    }
  }

  /**
   * formにsubmitイベントをつける
   * @param {HTMLFormElement} form
   */
  p._setSubmitEvent = function (form) {
    var self = this
    // 元から設定されているsubmitイベントがあれば一時保存
    var submitEvent = form.onsubmit || function() {}
    // 値の検証をしてから元のsubmitイベントを実行するように変更
    form.onsubmit = function (e) {
      var err = self._validateForm(form)
      if (err.length == 0) {
        // エラーがなければ元のsubmit処理を動かす
        submitEvent.apply(form, arguments)
      } else {
        // エラーがあれば、本当に送信するか尋ねるzs
        if (confirm(createWarnText(err))) {
          submitEvent.apply(form, arguments)
        } else {
          e.preventDefault()
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
    var err = []
    var inputs = getInputElements(form)

    // なければ終了
    if (inputs.length == 0) return err

    // 対象のタグの値を確認し、問題があればerrに追加
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i]
      if (!input.value) continue

      // 値のチェック
      var result = this.test(input.value)

      // 禁止事項が含まれている要素があれば、エラー文言を作成
      if (result && result.length > 0) {
        for (var j = 0; j < result.length; j++) {
          var tagName = input.tagName.toLowerCase()
          var elmName = (tagName === 'input') ? tagName + '[type="' + input.type + '"]' : tagName
          err.push(createErrText(elmName, result))
        }
      }
    }
    return err
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
    this.wordList = this.wordList.concat(wordList).filter(function(x, i, self) { return self.indexOf(x) === i })
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
    var self = this
    window.addEventListener('load', function () {
      self._setFormValidate()
    })
  }

	return FormValidate
}));