import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

// Cadastro
router.post('/cadastro', async (req, res) => {
  try {
    const user = req.body

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(user.password, salt)

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    })
    res.status(201).json(userDB)
  } catch (err) {
    res.status(500).json({ message: 'Erro no Servidor, tente novamente' })
  }
})

//lOGIN

router.post('/login', async (req, res) => {
  try {
    const userInfo = req.body

    // Busca o usuário no banco de dados
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    })

    // Verifica se o usuário existe dentro do banco
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    // Compara a senha do banco com a que o usuário digitou
    const isMatch = await bcrypt.compare(userInfo.password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha inválida' })
    }

    // Gerar o Token JWT
    const token = jwt.sign({ id: user.id}, JWT_SECRET, { expiresIn: '7d'})

    res.status(200).json(token)
  } catch (err) {
    res.status(500).json({ message: 'Erro no Servidor, tente novamente' })
  }
})

export default router

// rodolfo
// uwa0VeCytGp4uQ9t
//
