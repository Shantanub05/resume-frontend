import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function GET(request: NextRequest) {
  try {
    console.log('API Proxy: Received session info request')
    
    // Get the guest token from headers
    const guestToken = request.headers.get('x-guest-token')
    
    if (!guestToken) {
      return NextResponse.json(
        { error: 'No guest token provided' },
        { status: 401 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/guest/session/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-token': guestToken,
      },
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
    console.log('API Proxy: Success, returning session info')
    
    // Backend returns triple-nested structure: { success, data: { success, data: { actual_session_data } } }
    // Extract the actual session data from the deepest level
    return NextResponse.json({
      success: true,
      data: data.data.data, // Extract from triple nesting
      message: data.data.message || 'Session info retrieved successfully',
    })
  } catch (error) {
    console.error('API Proxy: Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}