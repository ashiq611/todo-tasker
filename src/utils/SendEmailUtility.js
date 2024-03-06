const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ashiqur.rahman.dev@gmail.com",
        pass: "qmee tbkl mabk cwdk",
      },
    });

    // send mail with defined transport object
    let mailOptions = {
      from: '"Todo Tasker" <ashiqur.rahman.dev@gmail.com>',
      to: email,
      subject: subject,
      text: text,
    };
    //     console.log(mailOptions);
    await transporter.sendMail(mailOptions);

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
