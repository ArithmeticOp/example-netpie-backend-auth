const express = require('express')
const rest = require('restler')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/doSomethings', doSomethings)

let expiredAt = 0;
let access_token = null;
let refresh_token = null;

function doSomethings(req, res, next) {
    let body = req.body

    if (expiredAt < Math.floor(Date.now() / 1000)) {
        if (!refresh_token) {
            rest.post('http://auth.netpie.io/oauth/token', {
                data: {
                    client_id: "xxx",
                    client_secret: "xxx",
                    username: "xxx",
                    password: "xxx",
                    grant_type: "password"
                }
            }).on('complete', (data, response) => {
                expiredAt = data.exp;
                access_token = data.access_token;
                refresh_token = data.refresh_token;
                if (access_token) res.send('OK')
                else res.send('FAIL')
            })
        }
        else {
            rest.post('http://auth.netpie.io/oauth/token', {
                data: {
                    client_id: "xxx",
                    client_secret: "xxx",
                    refresh_token: refresh_token,
                    grant_type: "refresh_token"
                }
            }).on('complete', (data, response) => {
                expiredAt = data.exp;
                access_token = data.access_token;
                refresh_token = data.refresh_token;
                if (access_token) res.send('OK')
                else res.send('FAIL')
            })
        }
    }
    else {
        res.send('OK')
    }
}

app.listen(3010)