// app/components/JerseyChecker.tsx
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { JerseyInfo } from '@/pages/api/jersey'

const JerseyChecker: React.FC = () => {
  const [team, setTeam] = useState('MSP Putra')
  const [jerseyNumber, setJerseyNumber] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [isNumberAvailable, setIsNumberAvailable] = useState(false)
  const [checkLoading, setCheckLoading] = useState(false)
  const [generateLoading, setGenerateLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!jerseyNumber.trim()) {
      setError('Please enter a jersey number')
      return
    }
    setError(null)
    setCheckLoading(true)
    try {
      const response = await fetch('/api/jersey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'check', number: jerseyNumber, team }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      if (data.available) {
        setResult(`<p class="text-green-500">Yeay! Selamat!</p><small>#${jerseyNumber} belum dimiliki. Segera pesan!</small>`)
        setIsNumberAvailable(true)
      } else {
        setResult(`<p class="text-red-500">${data.message}</p> <ol>${data.jerseyInfo.map((jersey: JerseyInfo) => `<li class="text-sm"><small>${jersey.name} (${jersey.team})</small></li>`).join('')}</ol>`)
        setIsNumberAvailable(false)
      }
    } catch (error) {
      setResult('An error occurred while checking the jersey number.')
      console.error('Error:', error)
    } finally {
      setCheckLoading(false)
    }
  }

  const handleGenerate = async () => {
    setError(null)
    setGenerateLoading(true)
    try {
      const response = await fetch('/api/jersey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'generate' }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const data = await response.json()
      setResult(`${data.generatedNumber}`)
      setJerseyNumber(data.generatedNumber.toString())
    } catch (error) {
      setResult('An error occurred while generating a jersey number.')
      console.error('Error:', error)
    } finally {
      setGenerateLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      setJerseyNumber(value)
      setError(null)
    } else {
      setError('Please enter numbers only')
    }
  }

  const isLoading = checkLoading || generateLoading

  return (
    <>
      <div className="flex items-center bg-white pt-4 justify-between">
        <h1 className="text-[#111418] text-lg font-bold leading-tight tracking-tight text-center flex-1">
          Cek Jersey Number
        </h1>
      </div>

      <div className="@container max-w-[300px] mx-auto">
        <div className="@[300px]:px-4 @[300px]:py-3">
          <div className="bg-white @[300px]:rounded-xl overflow-hidden">
            <Image
              src="/msp.png"
              alt="Logo"
              width={480}
              height={218}
              layout="responsive"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 py-1 max-w-[480px] mx-auto">
        <div className="relative">
          <select
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="appearance-none w-full rounded-xl text-[#111418] focus:outline-none focus:ring-0 border-none bg-[#f0f2f5] h-14 px-4 pr-8 text-base font-normal"
          >
            <option value="MSP Putra">MSP Putra</option>
            <option value="MSP Putri">MSP Putri</option>
            <option value="MSP Junior">MSP Junior</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#111418]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
        <div className="flex items-stretch rounded-xl">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter a number"
            className={`form-input w-full rounded-xl text-[#111418] focus:outline-none focus:ring-0 border-none bg-[#f0f2f5] h-14 placeholder:text-[#60758a] p-4 text-center ${
              error ? 'border-red-500' : ''
            }`}
            value={jerseyNumber}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex flex-wrap gap-3 px-4 py-3 max-w-[480px] mx-auto justify-center">
          <button
            className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center rounded-xl h-12 px-5 bg-[#0d7cf2] text-white text-base font-bold leading-normal tracking-tight grow disabled:opacity-50"
            onClick={handleCheck}
            disabled={jerseyNumber.trim().length === 0 || isLoading}
          >
            <span className="truncate">{checkLoading ? 'Checking...' : 'Check'}</span>
          </button>
          <button
            className="flex min-w-[84px] w-full sm:w-auto cursor-pointer items-center justify-center rounded-xl h-12 px-5 bg-[#f0f2f5] text-[#111418] text-base font-bold leading-normal tracking-tight grow disabled:opacity-50"
            onClick={handleGenerate}
            disabled={isLoading}
          >
            <span className="truncate">{generateLoading ? 'Generating...' : 'Generate for Me'}</span>
          </button>
        </div>
      </div>

      {result && (<div className="flex flex-col items-center justify-center px-4 py-6 max-w-[480px] mx-auto text-center">
        <p className="text-2xl font-bold mb-4">
          <div dangerouslySetInnerHTML={{ __html: result }} />
        </p>
        {isNumberAvailable && <>
          <a
            href="https://forms.gle/ZtKE7cAquHytydTS8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#0d7cf2] text-white text-lg font-bold py-3 px-6 rounded-xl hover:bg-[#0b6ad3] transition-colors duration-300"
          >
            Pesan Jersey
          </a>
        </>}
      </div>)}

      {error && (
        <div className="flex justify-center">
          <p className="text-red-500 text-base">{error}</p>
        </div>
      )}

      <div className="h-5 bg-white"></div>
    </>
  );

}

export default JerseyChecker