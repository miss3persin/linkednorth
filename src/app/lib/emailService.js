const MAILJET_API_KEY = process.env.MAILJET_API_KEY
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY
const MAILJET_FROM_EMAIL = process.env.MAILJET_FROM_EMAIL
const MAILJET_FROM_NAME = process.env.MAILJET_FROM_NAME || 'LinkedNorth'
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'LinkedNorth'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://linkednorth.com'

function ensureMailjetConfig() {
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY || !MAILJET_FROM_EMAIL) {
    throw new Error(
      'Email delivery is not configured (set MAILJET_API_KEY, MAILJET_SECRET_KEY, and MAILJET_FROM_EMAIL).'
    )
  }
}

function toRecipientObject(candidate) {
  if (!candidate) return null
  if (typeof candidate === 'string') {
    return { Email: candidate }
  }
  const email = candidate.Email || candidate.email
  if (!email) return null
  return {
    Email: email,
    Name: candidate.Name || candidate.name,
  }
}

function formatRecipients(recipient) {
  if (!recipient) return []
  if (Array.isArray(recipient)) {
    return recipient.map(toRecipientObject).filter(Boolean)
  }
  const formatted = toRecipientObject(recipient)
  return formatted ? [formatted] : []
}

async function sendMail({ to, subject, text, html, replyTo }) {
  ensureMailjetConfig()
  const basicAuth = Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString('base64')
  const recipients = formatRecipients(to)

  if (!recipients.length) {
    throw new Error('No recipients were provided for the email.')
  }

  const message = {
    From: {
      Email: MAILJET_FROM_EMAIL,
      Name: MAILJET_FROM_NAME,
    },
    To: recipients,
    Subject: subject,
    TextPart: text,
    HTMLPart: html,
  }

  if (replyTo?.email) {
    message.ReplyTo = {
      Email: replyTo.email,
      Name: replyTo.name || replyTo.email,
    }
  }

  const response = await fetch('https://api.mailjet.com/v3.1/send', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      Messages: [message],
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Failed to send email (${response.status}): ${errorBody}`)
  }
}

function buildEmailContent({ firstName, code }) {
  const displayName = firstName?.trim() || 'there'
  const text =
    `Hi ${displayName},\n\n` +
    `Use the code below to finish signing up for ${APP_NAME}:\n\n` +
    `${code}\n\n` +
    `The code expires in 15 minutes. If you did not request this, just ignore this message.\n\n` +
    `Thanks,\n${APP_NAME} Team`

  const html = `
    <div style="font-family: system-ui, sans-serif; line-height: 1.5; color: #111;">
      <p style="margin-bottom: 16px;">Hi ${displayName},</p>
      <p style="margin-bottom: 24px;">Use the code below to finish signing up for <strong>${APP_NAME}</strong>:</p>
      <p style="margin: 0 0 24px; font-size: 20px; letter-spacing: 4px; font-weight: 600;">${code}</p>
      <p style="margin-bottom: 16px;">The code expires in 15 minutes. If you did not request this, simply ignore this email.</p>
      <p style="margin-bottom: 4px;">Thanks,<br>${APP_NAME} Team</p>
      <p style="margin: 0; font-size: 12px; color: #6b7280;"><a href="${APP_URL}" style="color: #2563eb; text-decoration: none;">${APP_NAME}</a></p>
    </div>
  `

  return { text, html }
}

export async function sendVerificationEmail({ email, code, firstName }) {
  const { text, html } = buildEmailContent({ firstName, code })
  await sendMail({
    to: email,
    subject: `${APP_NAME} verification code`,
    text,
    html,
  })
}
