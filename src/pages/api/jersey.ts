// pages/api/jersey.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { google } from 'googleapis'

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

const sheets = google.sheets({ version: 'v4', auth })

async function getSheetData() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: 'A:H', // Adjust this range based on your sheet structure
  })
  return response.data.values || []
}

export interface JerseyInfo {
  name: string;
  gender: string;
  size: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { action, number, gender } = req.body
    const data = await getSheetData()

    if (action === 'check') {
      const jerseyInfo: JerseyInfo[] = [];
      for (let i = 1; i < data.length; i++) {
        if (data[i] && data[i][7] === number && data[i][5] === gender) {
          jerseyInfo.push({
            name: data[i][4],
            gender: data[i][5],
            size: data[i][6]
          });
        }
      }
      if (jerseyInfo.length === 0) {
        return res.json({ available: true, message: `Jersey number ${number} is available.` });
      }

      return res.json({
        available: false,
        message: `#${number} sudah di miliki ${jerseyInfo.length} pemain.`, 
        jerseyInfo
      });
    } else if (action === 'generate') {
      const usedNumbers = data?.slice(1).map(row => parseInt(row[7])).filter(Boolean)
      let generatedNumber
      do {
        generatedNumber = Math.floor(Math.random() * 99) + 1 // Generate number between 1 and 99
      } while (usedNumbers?.includes(generatedNumber))
      return res.status(200).json({ generatedNumber })
    } else {
      return res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    console.error('API route error:', error)
    res.status(500).json({ error: 'Failed to process request' })
  }
}