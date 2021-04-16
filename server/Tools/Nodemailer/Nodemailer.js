require('dotenv').config();
const userModel = require('../../Model/User/User')
const EventEmitter = require('events');
EventEmitter.captureRejection = true; 

class MailEmitter extends EventEmitter {};

const mailEmmiter = new MailEmitter();

const nodemailer = require("nodemailer");

async function mail(applicants, message, subject) {
  // let testAccount = await nodemailer.createTestAccount();
  const chosenApplicants = applicants.join(', ');
  let transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD
    }
  });

  let info = await transporter.sendMail({
    from: 'Notification <nmerg@bk.ru>', 
    to: `${chosenApplicants}`, 
    subject: `${subject}`, 
    text: `${message}`, 
  });
}

mailEmmiter.on('send-mail', mail);

const getMails = async (message) => {
  let mails = []
  let messageArray = message.split(/\b/)
  messageArray.forEach((item, index) => {
    let symbol = item.slice(-1)
    if (symbol === '@') mails.push(messageArray[index+1])
  })
  mails = await Promise.all(mails.map(async (username) => {
    const user = await userModel.findOne({username: username})
    return user.mail
  }))
  mails = mails.filter(mail => mail)
  if (mails.length) {
    mailEmmiter.emit('send-mail', mails, message, 'Notification');
  }
}

module.exports = {getMails};
