const FormValidate = require('../lib/form_validate')

/**
 * FormValidate.test()関数のテスト
 */
test('test test', () => {
  const formValidate = new FormValidate()

  expect(formValidate.test('https://example.test.com')).toEqual(true)
  expect(formValidate.test('https://admin.example.com')).toEqual(true)
  expect(formValidate.test('https://example.com')).toEqual(false)
})

/**
 * FormValidate.addWord()関数のテスト
 */
test('test addWord', () => {
  const formValidate = new FormValidate()

  expect(formValidate.test('https://example.test.com')).toEqual(true)
  expect(formValidate.test('https://admin.example.com')).toEqual(true)
  expect(formValidate.test('https://example.com?token=aaaaaaaaaaaa')).toEqual(false)

  formValidate.addWord('token=')
  expect(formValidate.test('https://example.com')).toEqual(false)
  expect(formValidate.test('https://example.com?token=aaaaaaaaaaaa')).toEqual(true)
})

/**
 * FormValidate.replaceWord()関数のテスト
 */
test('test replaceWord', () => {
  const formValidate = new FormValidate()

  expect(formValidate.test('https://example.test.com')).toEqual(true)
  expect(formValidate.test('https://admin.example.com')).toEqual(true)
  expect(formValidate.test('https://example.com')).toEqual(false)

  formValidate.replaceWord(['sample'])

  expect(formValidate.test('https://example.test.com')).toEqual(false)
  expect(formValidate.test('https://admin.example.com')).toEqual(false)
  expect(formValidate.test('https://example.com')).toEqual(false)
  expect(formValidate.test('https://sample.com')).toEqual(true)
  expect(formValidate.test('https://example.com?sample=123')).toEqual(true)
})
