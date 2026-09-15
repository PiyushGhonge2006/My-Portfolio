import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const admin = await Admin.findOne({ email })

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    })
  } else {
    res.status(401).json({ message: 'Invalid email or password' })
  }
}

export const getMe = async (req, res) => {
  res.json(req.admin)
}

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const admin = await Admin.findById(req.admin._id)

  if (!(await admin.matchPassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' })
  }

  admin.password = newPassword
  await admin.save()
  res.json({ message: 'Password updated successfully' })
}