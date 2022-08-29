import passport from 'passport'
import bcrypt from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '@/db/models/user'

export default function () {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await User.findOne({ id: id }, { password: 0 })
      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  })
  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email })
          if (!user)
            return done(null, false, { message: '사용자를 찾을 수 없습니다.' })
          const isValid = bcrypt.compareSync(password, user.password)
          if (!isValid)
            return done(null, false, {
              message: '비밀번호가 일치 하지 않습니다.'
            })
          return done(null, user, { message: '로그인을 성공했습니다.' })
        } catch (err) {
          return done(err)
        }
      }
    )
  )
}
