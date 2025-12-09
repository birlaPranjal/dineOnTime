import nodemailer from "nodemailer"

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  })
}

export async function sendOTPEmail(email: string, otp: string, name?: string): Promise<void> {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"DineOnTime" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - DineOnTime",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset OTP</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #DC0000 0%, #050E3C 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #fff; margin: 0;">DineOnTime</h1>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #050E3C; margin-top: 0;">Password Reset Request</h2>
            <p>Hello ${name || "User"},</p>
            <p>You have requested to reset your password. Please use the following OTP to proceed:</p>
            <div style="background: #f5f5f5; border: 2px dashed #DC0000; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <h1 style="color: #DC0000; font-size: 36px; letter-spacing: 5px; margin: 0; font-family: 'Courier New', monospace;">${otp}</h1>
            </div>
            <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">Best regards,<br>The DineOnTime Team</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`OTP email sent to ${email}`)
  } catch (error) {
    console.error("Error sending OTP email:", error)
    throw new Error("Failed to send OTP email")
  }
}

export async function sendRestaurantCredentialsEmail(
  email: string,
  ownerName: string,
  restaurantName: string,
  loginEmail: string,
  password: string
): Promise<void> {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: `"DineOnTime" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to DineOnTime - Your Restaurant Account Credentials",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restaurant Account Credentials</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #DC0000 0%, #050E3C 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #fff; margin: 0;">DineOnTime</h1>
          </div>
          <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #050E3C; margin-top: 0;">Welcome to DineOnTime!</h2>
            <p>Hello ${ownerName},</p>
            <p>Congratulations! Your partnership request for <strong>${restaurantName}</strong> has been approved.</p>
            <p>Your restaurant account has been created. Please use the following credentials to log in:</p>
            
            <div style="background: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #0c5460; font-size: 14px;">
                <strong>📋 Next Steps:</strong>
              </p>
              <ol style="margin: 10px 0 0 20px; color: #0c5460; font-size: 14px; padding-left: 0;">
                <li style="margin-bottom: 8px;">Log in to your dashboard using the credentials below</li>
                <li style="margin-bottom: 8px;">Complete your restaurant profile with all required details</li>
                <li style="margin-bottom: 8px;">Submit your profile for admin review</li>
                <li>Once approved, your restaurant will go live and can accept bookings!</li>
              </ol>
            </div>
            
            <div style="background: #f5f5f5; border: 2px solid #DC0000; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <div style="margin-bottom: 15px;">
                <p style="margin: 0; font-weight: bold; color: #050E3C;">Login Email:</p>
                <p style="margin: 5px 0 0 0; font-size: 16px; color: #DC0000;">${loginEmail}</p>
              </div>
              <div>
                <p style="margin: 0; font-weight: bold; color: #050E3C;">Password:</p>
                <p style="margin: 5px 0 0 0; font-size: 16px; color: #DC0000; font-family: 'Courier New', monospace;">${password}</p>
              </div>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⚠️ Security Notice:</strong> Please change your password after your first login for security purposes.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/restaurant/login" 
                 style="background: #DC0000; color: #fff; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Login to Dashboard
              </a>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions or need assistance, please don't hesitate to contact our support team.
            </p>
            <p style="color: #666; font-size: 14px; margin-top: 20px;">
              Best regards,<br>
              <strong>The DineOnTime Team</strong>
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </body>
        </html>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Restaurant credentials email sent to ${email}`)
  } catch (error) {
    console.error("Error sending restaurant credentials email:", error)
    throw new Error("Failed to send restaurant credentials email")
  }
}

