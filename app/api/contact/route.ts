import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const CONTACT_RECIPIENT = 'miyaka@ebaseafrica.org'

export async function POST(request: Request) {
  const { name, email, message } = await request.json()

  if (!email || !message) {
    return NextResponse.json({ error: 'Email and message are required' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      // Works immediately with a bare API key. Once ebaseafrica.org is a verified
      // domain in Resend, switch this to an address on that domain (e.g.
      // "iCODE Abakwa <contact@ebaseafrica.org>") for better deliverability/branding.
      from: 'iCODE Abakwa <onboarding@resend.dev>',
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: `New message from ${name || 'the iCODE website'}`,
      text: `From: ${name || 'Anonymous'} <${email}>\n\n${message}`,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending contact email:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
