import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function POST(request: NextRequest) {
  try {
    console.log('API Proxy: Received resume upload request')
    
    // Get the guest token from headers
    const guestToken = request.headers.get('x-guest-token')
    
    if (!guestToken) {
      return NextResponse.json(
        { error: 'No guest token provided' },
        { status: 401 }
      )
    }

    // Get the form data
    const formData = await request.formData()

    const response = await fetch(`${BACKEND_URL}/resumes/upload`, {
      method: 'POST',
      headers: {
        'x-guest-token': guestToken,
      },
      body: formData, // Forward the form data as-is
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
    console.log('API Proxy: Success, file uploaded')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy: Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}