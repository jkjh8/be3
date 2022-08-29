export const loggedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.status(403).send(null)
  }
}

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next()
  } else {
    res.status(403).send(null)
  }
}
