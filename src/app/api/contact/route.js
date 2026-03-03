'use server'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

const CONTACT_TABLE = 'contact_submissions'

function normalizeText(value) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function buildErrorResponse(message) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function POST(request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const payload = await request.json().catch(() => ({}))
  const name = normalizeText(payload.name)
  const email = normalizeText(payload.email)
  const subject = normalizeText(payload.subject)
  const message = normalizeText(payload.message)

  if (!name || !email || !subject || !message) {
    return buildErrorResponse('Please provide name, email, subject, and message.')
  }

  const entry = {
    name,
    email,
    subject,
    message,
    status: 'new',
  }

  try {
    const { error, data } = await supabaseAdmin
      .from(CONTACT_TABLE)
      .insert(entry)
      .select('id, created_at')
      .single()

    if (error) {
      console.error('Supabase insert error', error)
      return NextResponse.json(
        {
          error:
            'We could not save your message right now. Please try again shortly.',
        },
        { status: 500 }
      )
    }

    console.log('contact insert result', data)

    return NextResponse.json({ success: true, messageId: data?.id })
  } catch (error) {
    console.error('Unexpected contact-route error', error)
    return NextResponse.json(
      { error: 'Something unexpected happened. Please try again soon.' },
      { status: 500 }
    )
  }
}
