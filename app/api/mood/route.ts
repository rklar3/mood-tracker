import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { phrase } = await req.json()

    if (!phrase) {
      return NextResponse.json(
        { message: 'Phrase is required' },
        { status: 400 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        prompt: `Based on this phrase "${phrase}", determine the mood category and suggest a color gradient. Provide the response in the format: { "mood": "category", "colors": ["#color1", "#color2", "#color3"] }`,
        max_tokens: 100,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('OpenAI API Error:', errorData)
      throw new Error(`OpenAI API Error: ${errorData.error.message}`)
    }

    const data = await response.json()
    const parsedData = JSON.parse(data.choices[0].text.trim())

    return NextResponse.json(parsedData)
  } catch (error) {
    console.error('Error fetching mood and colors from OpenAI:', error)
    return NextResponse.json(
      { message: 'Error fetching data from OpenAI' },
      { status: 500 }
    )
  }
}
