// Vercel Serverless Function — proxies Booking.com Search Hotels
// so the RapidAPI key stays server-side (never shipped to the browser).

const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com'

export default async function handler(req, res) {
  const { dest_id, arrival_date, departure_date } = req.query
  if (!dest_id || !arrival_date || !departure_date) {
    return res.status(400).json({
      error: 'Missing required query params: dest_id, arrival_date, departure_date',
    })
  }

  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing RAPIDAPI_KEY env var' })
  }

  const url =
    `https://${RAPIDAPI_HOST}/api/v1/hotels/searchHotels` +
    `?dest_id=${encodeURIComponent(dest_id)}` +
    `&search_type=CITY` +
    `&arrival_date=${encodeURIComponent(arrival_date)}` +
    `&departure_date=${encodeURIComponent(departure_date)}` +
    `&adults=2&room_qty=1&units=metric&currency_code=EUR`

  try {
    const upstream = await fetch(url, {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
    })
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
