import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // TODO: Replace with actual backend API call
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password }),
    // })

    // For now, mock successful response
    return NextResponse.json({
      message: 'Login successful',
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email,
        role: 'user',
      },
    }, { status: 200 })
  } catch (error) {
    console.error('[v0] Login error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
