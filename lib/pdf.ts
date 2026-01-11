// Simple PDF generation using HTML to Data URI conversion
// For production use, consider using libraries like: react-pdf, pdfkit, or html2pdf

export interface BookingReceiptData {
  bookingReference: string
  customerName: string
  customerEmail: string
  customerPhone: string
  tripType: 'one-way' | 'round-trip'
  fromCity: string
  toCity: string
  passengers: number
  passengerNames: string[]
  departDate: string
  returnDate?: string
  basePrice: number
  discount: number
  total: number
  promoCode?: string
  bookingDate: string
}

export function generateBookingPDF(data: BookingReceiptData): string {
  // Generate an HTML receipt
  const passengerNames = data.passengerNames.filter((n) => n.trim())
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Booking Receipt - ${data.bookingReference}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; margin: -40px -40px 30px -40px; border-radius: 8px 8px 0 0; text-align: center; }
        .header h1 { font-size: 28px; margin-bottom: 5px; }
        .header p { font-size: 14px; opacity: 0.9; }
        .reference-box { background: #f3f4f6; padding: 20px; margin-bottom: 30px; border-left: 4px solid #667eea; border-radius: 4px; }
        .reference-box label { display: block; font-size: 12px; color: #6b7280; margin-bottom: 5px; }
        .reference-box .ref { font-size: 22px; font-weight: bold; color: #667eea; font-family: 'Courier New', monospace; }
        .section { margin-bottom: 30px; }
        .section h2 { font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        .detail-item { }
        .detail-item label { display: block; font-size: 11px; color: #6b7280; margin-bottom: 4px; font-weight: 600; }
        .detail-item value { display: block; font-size: 14px; color: #111827; font-weight: 500; }
        .full-width { grid-column: 1 / -1; }
        .passengers-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .passenger-tag { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        .pricing-section { background: #f0f9ff; border: 2px solid #bfdbfe; border-radius: 6px; padding: 20px; }
        .price-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .price-row.header { font-weight: 600; color: #1e3a8a; }
        .price-row.discount { color: #16a34a; border-top: 1px solid #bfdbfe; padding-top: 10px; }
        .price-row.total { font-weight: bold; color: #667eea; font-size: 18px; border-top: 2px solid #667eea; padding-top: 10px; margin-top: 10px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
        .footer-text { margin: 8px 0; }
        @media print { body { background: white; padding: 0; } .container { box-shadow: none; padding: 20px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✈️ BOOKING RECEIPT</h1>
          <p>Amannual Travel</p>
        </div>
        
        <div class="reference-box">
          <label>BOOKING REFERENCE</label>
          <div class="ref">${data.bookingReference}</div>
        </div>

        <div class="section">
          <h2>Customer Information</h2>
          <div class="details-grid">
            <div class="detail-item">
              <label>Name</label>
              <value>${data.customerName}</value>
            </div>
            <div class="detail-item">
              <label>Email</label>
              <value>${data.customerEmail}</value>
            </div>
            <div class="detail-item">
              <label>Phone</label>
              <value>${data.customerPhone}</value>
            </div>
            <div class="detail-item">
              <label>Booking Date</label>
              <value>${new Date(data.bookingDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</value>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Trip Details</h2>
          <div class="details-grid">
            <div class="detail-item">
              <label>Route</label>
              <value>${data.fromCity} → ${data.toCity}</value>
            </div>
            <div class="detail-item">
              <label>Trip Type</label>
              <value>${data.tripType === 'round-trip' ? 'Round-trip' : 'One-way'}</value>
            </div>
            <div class="detail-item">
              <label>Departure Date</label>
              <value>${new Date(data.departDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</value>
            </div>
            ${
              data.returnDate
                ? `<div class="detail-item">
              <label>Return Date</label>
              <value>${new Date(data.returnDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</value>
            </div>`
                : ''
            }
            <div class="detail-item full-width">
              <label>Number of Passengers</label>
              <value>${data.passengers}</value>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Travelers</h2>
          <div class="passengers-list">
            ${passengerNames.map((name) => `<div class="passenger-tag">${name}</div>`).join('')}
          </div>
        </div>

        <div class="section">
          <div class="pricing-section">
            <div class="price-row header">
              <span>PRICING SUMMARY</span>
            </div>
            <div class="price-row">
              <span>Base Price (${data.passengers} × \$850)</span>
              <span>\$${data.basePrice.toFixed(2)}</span>
            </div>
            ${
              data.discount > 0
                ? `<div class="price-row discount">
              <span>Promo Discount (${data.promoCode || '10%'})</span>
              <span>-\$${data.discount.toFixed(2)}</span>
            </div>`
                : ''
            }
            <div class="price-row total">
              <span>TOTAL</span>
              <span>\$${data.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div class="footer">
          <div class="footer-text">Thank you for choosing Amannual Travel!</div>
          <div class="footer-text">Our team will contact you shortly to confirm and finalize your booking.</div>
          <div class="footer-text" style="margin-top: 15px; font-weight: 500; color: #374151;">
            WhatsApp: +291 7197086 | Email: hello@amannualtravel.com
          </div>
          <div class="footer-text" style="margin-top: 15px; font-size: 10px;">
            © 2026 Amannual Travel. All rights reserved. | This is an automated document.
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  // Convert HTML to data URI for preview/download
  const encodedHtml = encodeURIComponent(htmlContent)
  return `data:text/html;charset=utf-8,${encodedHtml}`
}
