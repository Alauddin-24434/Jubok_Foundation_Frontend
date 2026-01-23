import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password } = body

    // Validation
    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual backend API call
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ firstName, lastName, email, phone, password }),
    // })

    // For now, mock successful response
    return NextResponse.json({
      message: 'User registered successfully',
      user: {
        id: '1',
        firstName,
        lastName,
        email,
        phone,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('[v0] Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
