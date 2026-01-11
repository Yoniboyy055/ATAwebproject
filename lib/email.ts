import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.SENDER_EMAIL || 'noreply@amannualtravel.com'

const resend = resendApiKey ? new Resend(resendApiKey) : null

export interface BookingConfirmationData {
  customerName: string
  customerEmail: string
  bookingReference: string
  tripType: 'one-way' | 'round-trip'
  fromCity: string
  toCity: string
  passengers: number
  passengerNames: string[]
  departDate: string
  returnDate?: string
  total: number
  promoCode?: string
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  if (!resend) {
    console.log(
      'Email service not configured. Set RESEND_API_KEY to enable emails.'
    )
    return { success: true, message: 'Email service not configured (demo mode)' }
  }

  const passengersText = data.passengerNames.filter((n) => n.trim()).join(', ')
  const discountApplied = data.promoCode === 'SAVE10' ? 'Yes (10% off)' : 'No'

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; }
          .content { background: #f9fafb; padding: 20px; margin-top: 20px; border-radius: 8px; }
          .reference { font-size: 24px; font-weight: bold; color: #667eea; margin: 20px 0; }
          .detail { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .label { font-weight: 600; color: #4b5563; }
          .total { font-size: 20px; font-weight: bold; color: #667eea; margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea; }
          .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmed!</h1>
            <p>Thank you for choosing Amannual Travel</p>
          </div>
          
          <div class="content">
            <p>Hello ${data.customerName},</p>
            <p>Your booking request has been received and confirmed. Here are your booking details:</p>
            
            <div class="reference">
              Booking Reference: <br/>${data.bookingReference}
            </div>
            
            <div class="detail">
              <span class="label">Trip Type:</span>
              <span>${data.tripType === 'round-trip' ? 'Round-trip' : 'One-way'}</span>
            </div>
            
            <div class="detail">
              <span class="label">Route:</span>
              <span>${data.fromCity} → ${data.toCity}</span>
            </div>
            
            <div class="detail">
              <span class="label">Departure Date:</span>
              <span>${new Date(data.departDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            ${
              data.returnDate
                ? `<div class="detail">
              <span class="label">Return Date:</span>
              <span>${new Date(data.returnDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>`
                : ''
            }
            
            <div class="detail">
              <span class="label">Passengers:</span>
              <span>${data.passengers}</span>
            </div>
            
            <div class="detail">
              <span class="label">Traveler Names:</span>
              <span>${passengersText}</span>
            </div>
            
            <div class="detail">
              <span class="label">Promo Applied:</span>
              <span>${discountApplied}</span>
            </div>
            
            <div class="total">
              Estimated Total: $${data.total.toFixed(2)}
            </div>
            
            <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">
              Our team will review your booking request and contact you shortly to confirm the final details and arrange payment.
            </p>
            
            <p style="margin-top: 20px; color: #6b7280; font-size: 14px;">
              <strong>Contact us:</strong><br/>
              WhatsApp: +291 7197086<br/>
              Email: hello@amannualtravel.com
            </p>
          </div>
          
          <div class="footer">
            <p>&copy; 2026 Amannual Travel. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: data.customerEmail,
      subject: `Booking Confirmed - Reference: ${data.bookingReference}`,
      html: emailHtml,
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Failed to send booking confirmation email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    }
  }
}
