import React from 'react'
import { Calendar, DateData } from 'react-native-calendars'
import { YStack, XStack, Text, Button, Card, ScrollView } from 'tamagui'
import { useCalendar, useAppStore } from '../store/useAppStore'
import { format, parseISO } from 'date-fns'

interface CalendarViewProps {
  onDateSelect?: (date: string) => void
  showEvents?: boolean
  height?: number
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  onDateSelect,
  showEvents = true,
  height = 400,
}) => {
  const { selectedDate, events } = useCalendar()
  const { setSelectedDate, addEvent, removeEvent } = useAppStore()

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString
    setSelectedDate(dateString)
    onDateSelect?.(dateString)
  }

  // Mark dates with events
  const markedDates = React.useMemo(() => {
    const marked: any = {}

    // Mark selected date
    if (selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: '#007AFF',
        selectedTextColor: '#FFFFFF',
      }
    }

    // Mark today
    const today = format(new Date(), 'yyyy-MM-dd')
    marked[today] = {
      ...marked[today],
      marked: true,
      dotColor: '#FF3B30',
    }

    // Mark dates with events
    events.forEach((event) => {
      const eventDate = format(parseISO(event.date), 'yyyy-MM-dd')
      if (marked[eventDate]) {
        marked[eventDate] = {
          ...marked[eventDate],
          marked: true,
          dotColor: '#34C759',
        }
      } else {
        marked[eventDate] = {
          marked: true,
          dotColor: '#34C759',
        }
      }
    })

    return marked
  }, [selectedDate, events])

  // Get events for selected date
  const selectedDateEvents = React.useMemo(() => {
    if (!selectedDate) return []
    return events.filter((event) => {
      const eventDate = format(parseISO(event.date), 'yyyy-MM-dd')
      return eventDate === selectedDate
    })
  }, [selectedDate, events])

  const addSampleEvent = () => {
    if (selectedDate) {
      addEvent({
        title: 'Sample Event',
        date: selectedDate,
        time: '10:00 AM',
        description: 'This is a sample event',
      })
    }
  }

  return (
    <YStack space="$3" height={height}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#007AFF',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#007AFF',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: '#ffffff',
          arrowColor: '#007AFF',
          disabledArrowColor: '#d9e1e8',
          monthTextColor: '#2d4150',
          indicatorColor: '#007AFF',
          textDayFontWeight: '300',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '300',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 13,
        }}
        style={{
          height: 350,
        }}
      />

      {showEvents && selectedDate && (
        <Card padding="$3" backgroundColor="$background">
          <YStack space="$2">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" fontWeight="bold">
                Events for {format(parseISO(selectedDate), 'MMM dd, yyyy')}
              </Text>
              <Button size="$2" onPress={addSampleEvent}>
                Add Event
              </Button>
            </XStack>

            <ScrollView maxHeight={150}>
              <YStack space="$2">
                {selectedDateEvents.length === 0 ? (
                  <Text color="$gray10" fontStyle="italic">
                    No events for this date
                  </Text>
                ) : (
                  selectedDateEvents.map((event) => (
                    <Card key={event.id} padding="$2" backgroundColor="$gray2">
                      <YStack space="$1">
                        <XStack justifyContent="space-between" alignItems="center">
                          <Text fontSize="$4" fontWeight="600">
                            {event.title}
                          </Text>
                          <Button
                            size="$1"
                            variant="outlined"
                            onPress={() => removeEvent(event.id)}
                          >
                            Remove
                          </Button>
                        </XStack>
                        {event.time && (
                          <Text fontSize="$3" color="$gray10">
                            Time: {event.time}
                          </Text>
                        )}
                        {event.description && (
                          <Text fontSize="$3" color="$gray10">
                            {event.description}
                          </Text>
                        )}
                      </YStack>
                    </Card>
                  ))
                )}
              </YStack>
            </ScrollView>
          </YStack>
        </Card>
      )}
    </YStack>
  )
}

// Compact calendar for smaller spaces
export const CompactCalendarView: React.FC<{
  onDateSelect?: (date: string) => void
}> = ({ onDateSelect }) => {
  const { selectedDate } = useCalendar()
  const { setSelectedDate } = useAppStore()

  const handleDayPress = (day: DateData) => {
    const dateString = day.dateString
    setSelectedDate(dateString)
    onDateSelect?.(dateString)
  }

  return (
    <Calendar
      onDayPress={handleDayPress}
      current={selectedDate || undefined}
      theme={{
        backgroundColor: '#ffffff',
        calendarBackground: '#ffffff',
        selectedDayBackgroundColor: '#007AFF',
        selectedDayTextColor: '#ffffff',
        todayTextColor: '#007AFF',
        dayTextColor: '#2d4150',
        arrowColor: '#007AFF',
        monthTextColor: '#2d4150',
        textDayFontWeight: '300',
        textMonthFontWeight: 'bold',
        textDayHeaderFontWeight: '300',
        textDayFontSize: 14,
        textMonthFontSize: 14,
        textDayHeaderFontSize: 12,
      }}
      style={{
        height: 280,
      }}
    />
  )
}
