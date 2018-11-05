import { getFirst, downloadFile, dedupe } from '../../utils'

describe('Util functions work accordingly', () => {
  test('getFirst finds first passing element', async () => {
    const els = [1, 2, 3, 4, 5, 6, 7]
    const el = getFirst(els, e => e % 2 === 0)

    expect(el).toEqual(2)
  })

  test('dedupe deduplicates elements in array', async () => {
    const els = [1, 1, 1, 1, 2, 3, 4, 5, 6, 7]

    expect(dedupe(els)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  test('downloadFile downloads a file', async () => {
    const fileURI = `https://raw.githubusercontent.com/maticzav/emma/master/emma.json`
    const file = await downloadFile(fileURI)

    expect(file).toEqual({
      boilerplates: ['starters/*'],
    })
  })
})
