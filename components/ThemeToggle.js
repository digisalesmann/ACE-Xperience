import {useState} from 'react'
export default function ThemeToggle(){
  const [dark,setDark] = useState(false)
  return (
    <button onClick={() => {
      setDark(!dark)
      document.documentElement.dataset.theme = dark ? 'light' : 'dark'
    }}>
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
