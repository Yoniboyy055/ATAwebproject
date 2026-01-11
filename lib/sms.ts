import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null

export interface BookingSMSData {
  phoneNumber: string
  phoneCountry: string
  customerName: string
  bookingReference: string
  fromCity: string
  toCity: string
  departDate: string
  total: number
}

export async function sendBookingSMS(data: BookingSMSData) {
  if (!twilioClient || !fromNumber) {
    console.log('SMS service not configured. Set TWILIO credentials to enable SMS.')
    return { success: true, message: 'SMS service not configured (demo mode)' }
  }

  const fullPhone = `${data.phoneCountry}${data.phoneNumber}`.replace(/[^\d+]/g, '')

  const message = `Hello ${data.customerName}! Your booking from ${data.fromCity} to ${data.toCity} on ${new Date(data.departDate).toLocaleDateString()} is confirmed. Reference: ${data.bookingReference}. Total: $${data.total.toFixed(2)}. - Amannual Travel`

  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: fullPhone,
    })

    return { success: true, messageSid: result.sid }
  } catch (error) {
    console.error('Failed to send booking SMS:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
    }
  }
}
