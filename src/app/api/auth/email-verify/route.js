import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/app/lib/supabaseAdmin'

function validatePayload({ email, code }) {
  if (!email || !code) return 'Email and code are required.'
  if (!/^[0-9]{6}$/.test(code)) return 'Enter a valid 6-digit code.'
  return null
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}))
  const { email, code } = body || {}
  const validationError = validatePayload({ email, code })
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  const { data: userRecord, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, auth_id, is_verified')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (userError) {
    console.error('Email verify user lookup error:', userError)
    return NextResponse.json({ error: 'Unable to verify the code right now.' }, { status: 500 })
  }

  if (!userRecord) {
    return NextResponse.json({ error: 'Account not found.' }, { status: 404 })
  }

  const { data: verification, error: verificationError } = await supabaseAdmin
    .from('email_verifications')
    .select('id, expires_at, code')
    .eq('user_id', userRecord.id)
    .eq('code', code)
    .order('expires_at', { ascending: false })
    .maybeSingle()

  if (verificationError) {
    console.error('Email verification lookup error:', verificationError)
    return NextResponse.json({ error: 'Unable to verify the code right now.' }, { status: 500 })
  }

  if (!verification) {
    return NextResponse.json({ error: 'Invalid verification code.' }, { status: 400 })
  }

  if (new Date(verification.expires_at) <= new Date()) {
    return NextResponse.json({ error: 'That verification code has expired.' }, { status: 400 })
  }

  const { error: deleteError } = await supabaseAdmin
    .from('email_verifications')
    .delete()
    .eq('id', verification.id)

  if (deleteError) {
    console.error('Failed to remove used verification code:', deleteError)
  }

  const { data: authUserData, error: authGetError } = await supabaseAdmin.auth.admin.getUserById(
    userRecord.auth_id
  )

  if (authGetError) {
    console.error('Unable to load auth user metadata:', authGetError)
  }

  const metadata = (authUserData?.user?.user_metadata || {}) ?? {}

  const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(userRecord.auth_id, {
    user_metadata: {
      ...metadata,
      is_verified: true,
    },
  })

  if (authUpdateError) {
    console.error('Failed to flag auth user as verified:', authUpdateError)
    return NextResponse.json({ error: 'Unable to complete verification.' }, { status: 500 })
  }

  const { error: updateUserError } = await supabaseAdmin
    .from('users')
    .update({ is_verified: true, updated_at: new Date().toISOString() })
    .eq('id', userRecord.id)

  if (updateUserError) {
    console.error('Failed to update users.is_verified:', updateUserError)
  }

  return NextResponse.json({ success: true })
}
