import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { cn } from "./ui/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./ui/input"
import { useState } from "react"

export function DatePickerWithRange({ defaultFrom, defaultTo, placeholder }: { defaultFrom: string | undefined, defaultTo: string | undefined, placeholder: string }) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: defaultFrom ? new Date(defaultFrom) : undefined,
    to: defaultTo ? new Date(defaultTo) : undefined,
  });

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[250px] justify-start text-left font-normal h-7",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Input type="hidden" name="dateFrom" value={date ? date.from?.toISOString().split('T')[0] : ''}></Input>
      <Input type="hidden" name="dateTo" value={date ? date.to?.toISOString().split('T')[0] : ''}></Input>
    </div>
  )
}
