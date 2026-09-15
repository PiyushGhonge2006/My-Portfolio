export const getMany = (Model, sort = {}) => async (req, res) => {
  const items = await Model.find({}).sort(sort)
  res.json(items)
}

export const getOne = (Model) => async (req, res) => {
  const item = await Model.findById(req.params.id)
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
}

export const createOne = (Model) => async (req, res) => {
  const item = await Model.create(req.body)
  res.status(201).json(item)
}

export const updateOne = (Model) => async (req, res) => {
  const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
}

export const deleteOne = (Model) => async (req, res) => {
  const item = await Model.findByIdAndDelete(req.params.id)
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json({ message: 'Deleted successfully', _id: req.params.id })
}

export const getFirstDoc = (Model) => async (req, res) => {
  const doc = await Model.findOne().sort({ createdAt: 1 })
  res.json(doc ? doc.toObject() : {})
}

export const upsertFirstDoc = (Model) => async (req, res) => {
  let doc = await Model.findOne().sort({ createdAt: 1 })
  if (!doc) doc = new Model(req.body)
  else Object.assign(doc, req.body)
  await doc.save()
  res.json(doc)
}