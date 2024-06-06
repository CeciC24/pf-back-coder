import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'ceciliacc3@gmail.com',
        pass: 'dhyn vtpt zqkt mgwf',
    }
})

export const sendTestEmail = () => {
    return transporter.sendMail({
        from: 'Coder Tests <ceciliacc3@gmail.com>',
        to: 'ceciliacc3@gmail.com',
        subject: 'Correo de prueba',
        html: `
        <div>
            <h1>Test</h1>
        </div>
        `,
        attachments: []
    })
}