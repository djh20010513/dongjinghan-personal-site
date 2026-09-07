import { useEffect } from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import { uiClick } from './lib/sound'

export default function App() {
  // one delegated listener → click sound for every HTML button / link
  useEffect(() => {
    const onUi = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest('button, a')) uiClick()
    }
    document.addEventListener('click', onUi, true)
    return () => document.removeEventListener('click', onUi, true)
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
