import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log('API Proxy: Reuploading resume:', id)
    
    // Get the guest token from headers
    const guestToken = request.headers.get('x-guest-token')
    
    if (!guestToken) {
      return NextResponse.json(
        { error: 'No guest token provided' },
        { status: 401 }
      )
    }

    // Get the form data from the request
    const formData = await request.formData()

    const response = await fetch(`${BACKEND_URL}/resumes/${id}/reupload`, {
      method: 'POST',
      headers: {
        'x-guest-token': guestToken,
      },
      body: formData,
    })

    console.log('API Proxy: Backend response:', response.status, response.statusText)

    if (!response.ok) {
      let errorMessage = `Backend error: ${response.status}`
      try {
        const errorData = await response.json()
        console.error('API Proxy: Backend error:', errorData)
        // Extract the actual error message from backend response
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch (parseError) {
        // If JSON parsing fails, try text
        try {
          const errorText = await response.text()
          console.error('API Proxy: Backend error (text):', errorText)
          errorMessage = errorText || errorMessage
        } catch {
          console.error('API Proxy: Could not parse error response')
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('API Proxy: Resume reuploaded successfully')
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API Proxy: Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}