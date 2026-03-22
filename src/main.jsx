import { SpeedInsights } from "@vercel/speed-insights/react"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<><App /><SpeedInsights /></>)