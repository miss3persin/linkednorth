import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'
import { upsertUser } from '@/services/userService'
import { sendVerificationEmail } from '@/app/lib/emailService'
import { randomUUID } from 'crypto'

const VERIFICATION_TTL_MS = 15 * 60 * 1000

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function validatePayload({ email, password, firstName, lastName }) {
  if (!email || !password || !firstName || !lastName) {
    return 'All fields are required.'
  }
  if (typeof password !== 'string' || password.length < 8) {
    return 'Password must be at least 8 characters.'
  }
  return null
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const { email, password, firstName, lastName } = body || {}
  const validationError = validatePayload({ email, password, firstName, lastName })
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    const { data, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      user_metadata: {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        is_verified: false,
      },
      email_confirm: true,
    })

    const supabaseUser = data?.user
    if (signUpError || !supabaseUser) {
      return NextResponse.json(
        { error: signUpError?.message || 'Unable to create your account.' },
        { status: 400 }
      )
    }

    await upsertUser({
      auth_id: supabaseUser.id,
      email: normalizedEmail,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    })

    const code = generateCode()
    const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS).toISOString()
    const { error: insertError } = await supabaseAdmin
      .from('email_verifications')
      .delete()
      .eq('user_id', supabaseUser.id)

    if (insertError) {
      console.error('Failed to clear old verification codes:', insertError)
    }

    const { error: insertVerificationError } = await supabaseAdmin.from('email_verifications').insert({
      id: randomUUID(),
      user_id: supabaseUser.id,
      code,
      expires_at: expiresAt,
    })

    if (insertVerificationError) {
      console.error('Email verification insert error:', insertVerificationError)
      return NextResponse.json({ error: 'Unable to send verification code.' }, { status: 500 })
    }

    await sendVerificationEmail({ email: normalizedEmail, firstName, code })

    return NextResponse.json(
      { message: 'Verification code sent. Check your email to finish signing up.' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Email signup error:', error)
    return NextResponse.json(
      { error: 'Unable to create your account. Please try again or contact support.' },
      { status: 500 }
    )
  }
}
