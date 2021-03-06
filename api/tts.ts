import * as googleTTS from 'google-tts-api'
import axios from 'axios'

import type { VercelRequest, VercelResponse } from '@vercel/node';

const tts = (req: VercelRequest, res: VercelResponse) => {
  if (req.method === 'GET') {
    const reqText: string = req.query.text as string
    const reqLang: string = req.query.lang as string || "th-TH"
    const slow: string = req.query.slow as string

    if (reqText !== '') {
      const resp = googleTTS.getAudioUrl(reqText, {
        lang: reqLang,
        slow: !!slow
      })

      axios.get(resp, { responseType: 'arraybuffer' }).then((response) => {
        const audio = Buffer.from(response.data, 'base64')
        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Content-Length': audio.length,
        })
        res.end(audio)
      })
    } else {
      res.send('')
    }
  } else {
    res.send('Your request is not valid')
  }
}

export default tts
