const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')

const sgMail = require('@sendgrid/mail');
const googleSpredSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const doc = '1QTnNuC_U_LAIdr8EvhZZuEInJmubdupK-haljqY7TnY'
const sgMailKey = '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'

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', async (request, response) => {
    try {
        const IdDoc = new googleSpredSheet(doc)
        await promisify(IdDoc.useServiceAccountAuth)(credentials)
        const info = await promisify(IdDoc.getInfo)()
        const worksheet = info.worksheets[0]
        await promisify(worksheet.addRow)({
            name: request.body.name,
            email: request.body.email,
            source: request.query.source || 'direct',
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            issueType: request.body.issueType
        })
        response.render('result')

        if (request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sgMailKey);
            const msg = {
                to: 'edsonbruno415@gmail.com',
                from: 'edsonbruno415@gmail.com',
                subject: 'ALERT BUG CRITICAL',
                text: `O usuário ${request.body.name} reportou um bug crítico.`,
                html: `O usuário ${request.body.name} reportou um bug crítico.`,
            };
            sgMail.send(msg);
        }
    } catch (err) {
        response.send('Não foi possivel relatar o bug!')
        console.log('Erro', err)
    }
})
app.listen(port, err => {
    if (err) {
        console.log('aconteceu um erro:', err)
    } else {
        console.log('App rodando em http://localhost:3000')
    }
})