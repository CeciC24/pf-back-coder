export function requireAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/login')
    }
    next()
}

export function redirectIfLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/profile')
    }
    next()
}

export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) { return res.status(401).send({ error: 'No autorizado' }) }
        if (!roles.includes(req.user.role)) { return res.status(403).send({ error: 'No tienes permisos suficientes' }) }
        next()
    }
}