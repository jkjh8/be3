import Hangul from 'hangul-js'

export const searchArrToStr = function (arr) {
  return Hangul.disassembleToString(arr.join('#').replace(/ /g, ''))
}

export const makeSearchField = function (schema, searchField, getter) {
  schema.pre('save', function () {
    this[searchField] = getter(this)
  })

  schema.post('updateOne', async function () {
    const docToUpdate = await this.model.findOne(this.getFilter())
    if (docToUpdate) await docToUpdate.save()
  })
}
