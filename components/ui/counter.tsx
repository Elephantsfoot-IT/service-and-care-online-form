import React from 'react'
import { Input } from './input'

interface CounterProps {
    value: number
    onChange: (value: number) => void
}
function Counter({ value, onChange }: CounterProps) {
  return (
    <div className='flex flex-row gap-2'>
        <Input></Input>
    </div>
  )
}

export default Counter