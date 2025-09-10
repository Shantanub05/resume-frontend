import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL

export async function POST(request: NextRequest) {
  try {
    console.log('API Proxy: Received guest session request')
    
    const body = await request.json()
    console.log('API Proxy: Request body:', body)

    const response = await fetch(`${BACKEND_URL}/guest/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    console.log('API Proxy: Backend response:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Proxy: Backend error:', errorText)
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('API Proxy: Success, returning data')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy: Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}