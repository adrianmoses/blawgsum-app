import { DateTime } from 'luxon';
import {FormControl, FormItem, FormLabel} from "@/src/components/ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "@/src/components/ui/popover";
import {Button} from "@/src/components/ui/button";
import {cn} from "@/src/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/src/components/ui/calendar";
import {Label} from "@/src/components/ui/label";
import {Input} from "@/src/components/ui/input";
import { SelectSingleEventHandler } from 'react-day-picker';
import {FieldErrors} from "react-hook-form";
import {useState} from "react";

interface ScheduledDateTimePickerProps {
    scheduledDate: Date;
    onChange: (date: Date) => void;
    errors: FieldErrors;
}

const ScheduledDateTimePicker = ({ scheduledDate, onChange }: ScheduledDateTimePickerProps) => {
    const [selectedDateTime, setSelectedDateTime] = useState<DateTime>(
        DateTime.fromJSDate(scheduledDate)
    )
    const handleSelect: SelectSingleEventHandler = (day, selected) => {
        const selectedDay = DateTime.fromJSDate(selected);
        const modifiedDay = selectedDay.set({
            hour: selectedDateTime.hour,
            minute: selectedDateTime.minute,
        });

        setSelectedDateTime(modifiedDay);
        onChange(modifiedDay.toJSDate());
    };

    const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { value } = e.target;
        const hours = Number.parseInt(value.split(':')[0] || '00', 10);
        const minutes = Number.parseInt(value.split(':')[1] || '00', 10);
        const modifiedDay = selectedDateTime.set({ hour: hours, minute: minutes });

        setSelectedDateTime(modifiedDay);
        onChange(modifiedDay.toJSDate());
    };

    return (
      <>
          <div className="w-3/4 mx-auto mt-4">
              <FormItem className="flex flex-col">
                  <FormLabel>Scheduled Time & Date</FormLabel>
                  <Popover>
                      <PopoverTrigger asChild>
                          <FormControl>
                              <Button
                                  variant={"outline"}
                                  className={cn("w-full pl-3 text-left font-normal",
                                      !scheduledDate && "text-muted-foreground")}
                              >
                                  {scheduledDate ? (
                                      selectedDateTime.toFormat("DDD HH:mm")
                                  ) : (
                                      <span>Pick a Date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                              </Button>
                          </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                          <Calendar
                              mode="single"
                              // @ts-ignore
                              selected={selectedDateTime.toJSDate()}
                              onSelect={handleSelect}
                              disabled={(date) =>
                                  date < new Date("1900-01-01")
                              }
                          />
                          <div>
                              <Label>Time</Label>
                              <Input
                                  type="time"
                                  onChange={handleTimeChange}
                                  value={selectedDateTime.toFormat("HH:mm")} />
                          </div>
                      </PopoverContent>
                  </Popover>
              </FormItem>
          </div>
      </>
  )
}

export default ScheduledDateTimePicker