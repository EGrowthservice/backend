// utils/sendEmail.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
    });
};
export const sendWelcomeEmail = async (email: string, name: string) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Chào mừng bạn đến với ứng dụng!',
        text: `Xin chào ${name}, cảm ơn bạn đã đăng ký!`,
    });
};