const googleSpredSheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

//utilizando assincrono
const addRowToSheet = async()=>{
    const IdDoc = new googleSpredSheet('1QTnNuC_U_LAIdr8EvhZZuEInJmubdupK-haljqY7TnY')
    await promisify(IdDoc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const info = await promisify(IdDoc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({ name: 'aaa', email: 'eee' })
}
addRowToSheet()

//utilizando sincrono
/*
IdDoc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('nao foi possivel abrir planilha')
    } else {
        console.log('planilha aberta')
        IdDoc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'alooo', email: 'bbb' }, err => {
                if (err) {
                    console.log('Bug nao enviado')
                } else {
                    console.log('Bug relatado com sucesso.')
                }
            })
        })
    }
})
*/
