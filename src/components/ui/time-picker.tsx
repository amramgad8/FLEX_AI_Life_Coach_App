
import * as React from "react"
import { Clock } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button"
import { format, parse, set } from "date-fns"

// This is a simple time picker, we'd need to enhance it later
interface TimePickerProps {
  value?: Date
  onChange?: (date: Date) => void
  disabled?: boolean
}

export function TimePicker({ value, onChange, disabled = false }: TimePickerProps) {
  const [time, setTime] = React.useState<string>(
    value ? format(value, "HH:mm") : "12:00"
  )

  // Update internal state when value prop changes
  React.useEffect(() => {
    if (value) {
      setTime(format(value, "HH:mm"))
    }
  }, [value])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value)
    
    if (onChange && e.target.value) {
      try {
        // Parse the input time and create a new date with the same day but updated time
        const timeParts = e.target.value.split(':')
        const hours = parseInt(timeParts[0], 10)
        const minutes = parseInt(timeParts[1], 10)
        
        const newDate = new Date(value || new Date())
        newDate.setHours(hours)
        newDate.setMinutes(minutes)
        
        onChange(newDate)
      } catch (error) {
        console.error("Invalid time format", error)
      }
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="icon" 
        disabled={disabled}
        type="button"
        tabIndex={-1} 
        className="pointer-events-none"
      >
        <Clock className="h-4 w-4" />
      </Button>
      <Input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="w-full"
        disabled={disabled}
      />
    </div>
  )
}
