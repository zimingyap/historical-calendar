import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f0f2f5;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const EventList = styled.div`
  margin-top: 20px;
  width: 80%;
  max-width: 600px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const EventItem = styled.div`
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f9f9f9;
  }

  &:last-child {
    border-bottom: none;
  }
`;

function App() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventDays, setEventDays] = useState([]);

  const fetchEvents = async (selectedDate) => {
    const month = selectedDate.getMonth() + 1; // Months are zero-indexed
    const day = selectedDate.getDate();

    try {
      const response = await fetch(
        `https://byabbe.se/on-this-day/${month}/${day}/events.json`
      );
      const data = await response.json();
      const topEvents = data.events.slice(0, 5);
      setEvents(topEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchEventDays = async (currentDate) => {
    const month = currentDate.getMonth() + 1;

    try {
      const response = await fetch(
        `https://byabbe.se/on-this-day/${month}/events.json`
      );
      const data = await response.json();
      const daysWithEvents = data.events.map((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getDate();
      });
      setEventDays([...new Set(daysWithEvents)]);
    } catch (error) {
      console.error("Error fetching event days:", error);
    }
  };

  useEffect(() => {
    // Fetch events whenever the selected date changes
    fetchEvents(date);
  }, [date]);

  useEffect(() => {
    // Fetch event days whenever the month changes
    fetchEventDays(date);
  }, [date]);
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <h1>Historical Calendar</h1>
        <Calendar
          onChange={setDate}
          value={date}
          tileClassName={({ date: calendarDate, view }) => {
            if (view === "month") {
              if (eventDays.includes(calendarDate.getDate())) {
                return "event-day";
              }
            }
          }}
        />
        {events.length > 0 && (
          <EventList>
            <h2>
              Events on {month} {day}
            </h2>
            {events.map((event, index) => (
              <EventItem key={index}>
                <h3>
                  {event.year}: {event.description}
                </h3>
              </EventItem>
            ))}
          </EventList>
        )}
      </AppContainer>
    </>
  );
}

export default App;
