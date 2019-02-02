const FormValidate = require('../lib/form_validate')

/**
 * FormValidate.test()関数のテスト
 */
test('test test', () => {
  const formValidate = new FormValidate()

  expect(formValidate.test('https://example.test.com')).toContainEqual('test')
  expect(formValidate.test('https://admin.example.com')).toContainEqual('admin')
  expect(formValidate.test('https://example.com')).toEqual(null)
})

/**
 * FormValidate.addWord()関数のテスト
 */
test('test addWord', () => {
  const formValidate = new FormValidate()

  expect(formValidate.test('https://example.test.com')).toContainEqual('test')
  expect(formValidate.test('https://admin.example.com')).toContainEqual('admin')
  expect(formValidate.test('https://example.com?token=aaaaaaaaaaaa')).toEqual(null)

  formValidate.addWord('token=')
  expect(formValidate.test('https://example.com')).toEqual(null)
  expect(formValidate.test('https://example.com?token=aaaaaaaaaaaa')).toContainEqual('token=')
})

/**
 * FormValidate.replaceWord()関数のテスト
 */
test('test replaceWord', () => {
  const formValidate = new FormValidate()

  expect(formValidate.test('https://example.test.com')).toContainEqual('test')
  expect(formValidate.test('https://admin.example.com')).toContainEqual('admin')
  expect(formValidate.test('https://example.com')).toEqual(null)

  formValidate.replaceWord(['sample'])

  expect(formValidate.test('https://example.test.com')).toEqual(null)
  expect(formValidate.test('https://admin.example.com')).toEqual(null)
  expect(formValidate.test('https://example.com')).toEqual(null)
  expect(formValidate.test('https://sample.com')).toContainEqual('sample')
  expect(formValidate.test('https://example.com?sample=123')).toContainEqual('sample')
})
