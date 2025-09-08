import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function POST(request: NextRequest) {
  try {
    console.log('API Proxy: Received resume analysis request')
    
    // Get the guest token from headers
    const guestToken = request.headers.get('x-guest-token')
    
    if (!guestToken) {
      return NextResponse.json(
        { error: 'No guest token provided' },
        { status: 401 }
      )
    }

    // Get the request body
    const body = await request.json()
    const { resumeId, jobDescription } = body
    
    console.log('API Proxy: Request body received:', { resumeId, jobDescription: jobDescription ? 'present' : 'not provided' })
    
    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      )
    }

    console.log('API Proxy: Forwarding analysis request for resume:', resumeId, jobDescription ? 'with job description' : 'without job description')

    const response = await fetch(`${BACKEND_URL}/resumes/${resumeId}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-guest-token': guestToken,
      },
      body: JSON.stringify({ jobDescription }),
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
    console.log('API Proxy: Analysis started successfully')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy: Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}