import { Calculator } from './components/Calculator'
import { ReferenceTable } from './components/ReferenceTable'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Daniels' Pace Calculator</h1>
          <p>
            根據《丹尼爾博士的跑步科學》計算您的 VDOT 與訓練配速
          </p>
        </div>
        
        <Calculator />

        <details className="reference-details">
          <summary>查看 VDOT 對照表 (Table 5.1)</summary>
          <ReferenceTable />
        </details>
      </section>
    </>
  )
}

export default App
