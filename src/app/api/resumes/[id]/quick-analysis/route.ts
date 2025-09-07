import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('API Proxy: Fetching quick analysis for resume:', id)
    
    // Get the guest token from headers
    const guestToken = request.headers.get('x-guest-token')
    
    if (!guestToken) {
      return NextResponse.json(
        { error: 'No guest token provided' },
        { status: 401 }
      )
    }

    const response = await fetch(`${BACKEND_URL}/resumes/${id}/quick-analysis`, {
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
    console.log('API Proxy: Quick analysis fetched successfully')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy: Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}