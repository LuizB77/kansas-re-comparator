const CLAUDE_MESSAGES = '/api/claude'

const SYSTEM_PROMPT =
  'You are a concise real estate analyst. Given comparison data for two locations, write exactly 4 sentences: (1) which is better for first-time buyers and why, (2) which is better for real estate investors and why, (3) which is better for families and why, (4) one specific risk flag for each location. Use the actual numbers in your response.'

function buildUserMessage(dataA, dataB) {
  return `Compare these two locations:
Location A (ZIP: ${dataA.zip}): Median home price $${dataA.medianSalePrice}, median rent $${dataA.medianRent}/mo, population ${dataA.population}, median income $${dataA.medianIncome}, unemployment ${dataA.unemploymentRate}%.
Location B (ZIP: ${dataB.zip}): Median home price $${dataB.medianSalePrice}, median rent $${dataB.medianRent}/mo, population ${dataB.population}, median income $${dataB.medianIncome}, unemployment ${dataB.unemploymentRate}%.`
}

export async function fetchAISummary(dataA, dataB) {
  try {
    const res = await fetch(CLAUDE_MESSAGES, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: buildUserMessage(dataA, dataB),
          },
        ],
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(
        errBody ? `${res.status} ${res.statusText}: ${errBody}` : res.statusText || `HTTP ${res.status}`,
      )
    }

    const json = await res.json()
    const text = json?.content?.[0]?.text
    if (typeof text !== 'string') {
      throw new Error('Missing assistant text in response')
    }
    return text
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    throw new Error(`Claude API error: ${message}`)
  }
}
