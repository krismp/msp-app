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
    range: 'A:I', // Adjust this range based on your sheet structure
  })
  return response.data.values || []
}

export interface JerseyInfo {
  name: string;
  team: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { action, number, team } = req.body
    const data = await getSheetData()

    if (action === 'check') {
      const jerseyInfo: JerseyInfo[] = [];
      for (let i = 1; i < data.length; i++) {
        if (data[i] && data[i][7] === number && data[i][8] === team) {
          jerseyInfo.push({
            name: data[i][4],
            team: data[i][8],
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
      const usedNumbers = new Set(
        data
          .slice(1)
          .filter(row => row[8] === team) // Filter by team
          .map(row => row[7]) // Keep as string to preserve "00"
          .filter(Boolean)
      )

      const allPossibleNumbers = ['00', '0', ...Array.from({length: 99}, (_, i) => (i + 1).toString().padStart(2, '0'))]
      const availableNumbers = allPossibleNumbers.filter(num => !usedNumbers.has(num))

      if (availableNumbers.length === 0) {
        return res.status(404).json({ error: `No available numbers found for team ${team}` })
      }

      // Randomly select one of the available numbers
      const randomIndex = Math.floor(Math.random() * availableNumbers.length)
      const generatedNumber = availableNumbers[randomIndex]

      // Select up to 5 numbers to return (including the generated one)
      const numbersToReturn = [generatedNumber]
      for (let i = 0; i < 4 && i < availableNumbers.length - 1; i++) {
        let index
        do {
          index = Math.floor(Math.random() * availableNumbers.length)
        } while (numbersToReturn.includes(availableNumbers[index]))
        numbersToReturn.push(availableNumbers[index])
      }

      return res.status(200).json({ 
        generatedNumber,
        availableNumbers: numbersToReturn
      })
    } else {
      return res.status(400).json({ error: 'Invalid action' })
    }
  } catch (error) {
    console.error('API route error:', error)
    res.status(500).json({ error: 'Failed to process request' })
  }
}