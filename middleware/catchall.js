import path from 'path'
import { fileURLToPath } from 'url'

const __filename = path.basename(fileURLToPath(import.meta.url))

export const catchall = (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')) {
        res.json({ error: '404 Not Found' })
    }
    else {
        res.type('txt').send('404 Not Found')
    }
}
