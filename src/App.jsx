import { useState } from 'react'
import ObjectDetection from './components/Object-detection'
function App() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-[32px]">
        <div className="text-center">
          <h1 className="gradient-title font-extrabold text-3xl md:text-3xl lg:text-8xl tracking-tighter md:px-6">
            Thief Detection Alarm
          </h1>
          <ObjectDetection/>
        </div>
      </main>
    </>
  )
}

export default App
