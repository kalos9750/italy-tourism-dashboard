// Vercel Serverless Function — proxies Booking.com Search Destination
// so the RapidAPI key stays server-side (never shipped to the browser).

const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com'

export default async function handler(req, res) {
  const { city } = req.query
  if (!city) {
    return res.status(400).json({ error: 'Missing required query param: city' })
  }

  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing RAPIDAPI_KEY env var' })
  }

  try {
    const upstream = await fetch(
      `https://${RAPIDAPI_HOST}/api/v1/hotels/searchDestination?query=${encodeURIComponent(city)}`,
      {
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': RAPIDAPI_HOST,
        },
      }
    )
    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ error: `Upstream error ${upstream.status}` })
    }
    const json = await upstream.json()
    res.status(200).json(json)
  } catch (err) {
    res.status(502).json({ error: 'Upstream fetch failed', detail: err.message })
  }
}
