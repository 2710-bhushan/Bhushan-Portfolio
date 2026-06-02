import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = (body?.name ?? "").toString().trim();
    const email = (body?.email ?? "").toString().trim();
    const message = (body?.message ?? "").toString().trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Configure Nodemailer with your Gmail credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1. Email sent to YOU (The Portfolio Owner)
    const mailToOwner = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      replyTo: email, 
      subject: `New Portfolio Contact from ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; padding: 40px 20px; color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155;">
            
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%); padding: 25px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 24px; letter-spacing: 1px;">New Contact Request</h2>
            </div>
            
            <div style="padding: 30px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #334155; color: #94a3b8; width: 80px;"><strong>Name:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #334155; color: #f1f5f9; font-weight: 500; font-size: 16px;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #334155; color: #94a3b8;"><strong>Email:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #334155; font-weight: 500; font-size: 16px;">
                    <a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a>
                  </td>
                </tr>
              </table>
              
              <h3 style="color: #38bdf8; margin-top: 0; margin-bottom: 15px; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Message</h3>
              <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; border-left: 4px solid #38bdf8; color: #e2e8f0; line-height: 1.6;">
                <p style="white-space: pre-wrap; margin: 0; font-size: 15px;">${message}</p>
              </div>
            </div>
            
            <div style="background-color: #0b1120; padding: 15px; text-align: center; color: #64748b; font-size: 12px;">
              Securely routed from your portfolio contact form.
            </div>
          </div>
        </div>
      `,
    };

    // 2. Auto-reply Email sent to the USER (The Visitor)
    const mailToUser = {
      from: process.env.EMAIL_USER,
      to: email, 
      subject: "Thank you for contacting me!",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; padding: 40px 20px; color: #334155;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
            
            <div style="background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%); padding: 35px 20px; text-align: center;">
              <h2 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">Message Received</h2>
            </div>
            
            <div style="padding: 35px;">
              <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-top: 0;">Hello <strong style="color: #0f172a;">${name}</strong>,</p>
              <p style="font-size: 16px; line-height: 1.6; color: #475569;">Thank you for visiting my portfolio and reaching out! I have successfully received your message and will review it as soon as possible.</p>
              
              <div style="margin: 35px 0; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #f8fafc; padding: 12px 15px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                  A copy of your message
                </div>
                <div style="padding: 20px; background-color: #ffffff;">
                  <p style="white-space: pre-wrap; margin: 0; font-size: 15px; color: #334155; line-height: 1.6; font-style: italic;">"${message}"</p>
                </div>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 35px;">I look forward to connecting with you shortly.</p>
              
              <div style="border-top: 2px solid #f1f5f9; padding-top: 25px;">
                <p style="margin: 0 0 4px 0; font-size: 20px; font-weight: 700; color: #0f172a;">Bhushan Ingale</p>
                <p style="margin: 0 0 15px 0; font-size: 14px; color: #64748b; font-weight: 500;">Full Stack Developer & Generative AI Engineer</p>
                
                <table style="border-collapse: collapse;">
                  <tr>
                    <td style="padding-right: 20px;">
                      <a href="https://linkedin.com/" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">LinkedIn</a>
                    </td>
                    <td style="padding-right: 20px;">
                      <a href="https://github.com/" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">GitHub</a>
                    </td>
                    <td style="padding-right: 20px;">
                      <a href="https://yourportfolio.com" style="color: #2563eb; text-decoration: none; font-weight: 600; font-size: 14px;">Portfolio</a>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      `,
    };

    // Send both emails concurrently
    await Promise.all([
      transporter.sendMail(mailToOwner),
      transporter.sendMail(mailToUser)
    ]);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Unable to send message right now. Please try again." },
      { status: 500 }
    );
  }
}