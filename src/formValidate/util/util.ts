import { TAG_LIST } from './const'

/**
 * 配列として扱える場合true
 * @param {Array} list
 * @return {boolean}
 */
export function isArray (list) {
  return Array.isArray(list) && list.length > 0
}

/**
 * 配列の中身を正規表現に変換
 * @param {Array} list
 * @return {regexp}
 */
export function arrayToRegexp (list) {
  return new RegExp(list.join('|'), 'i')
}

/**
 * beforeとafterを結合して、重複を削除した配列を返す
 * @param {Array} before
 * @param {Array} after
 * @return {Array}
 */
export function margeArray (before, after) {
  return before.concat(after).filter((x, i, self) => { return self.indexOf(x) === i })
}

/**
 * form配下のinputを取得
 * @param  {HTMLFormElement} form
 * @return {NodeList}
 */
export function getInputElements (form) {
  let selectorText = ''
  for (let i = 0; i < TAG_LIST.length; i++) {
    if (i > 0) {
      selectorText += ', '
    }
    selectorText += TAG_LIST[i]
  }
  return form.querySelectorAll(selectorText)
}

/**
 * 注意文章のタイトルを作成
 * @return {string}
 */
export function createTitleText () {
  return '本当に投稿しますか？'
}

/**
 * 注意文言の作成
 * @param  {Array} err
 * @return {string}
 */
export function createWarnText (err) {
  let tmp = '投稿文章に'
  for (let i = 0; i < err.length; i++) {
    tmp += '「' + err[i] + '」'
  }
  return tmp + 'が含まれています。'
}

/**
 * alertのライブラリを読み込む
 */
export function initLibrary () {
  // モーダル用
  const elSweetalert = document.createElement('script')
  elSweetalert.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@8'
  document.head.appendChild(elSweetalert)

  // promise用
  const elPromise = document.createElement('script')
  elPromise.src = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js'
  document.head.appendChild(elPromise)
}
