import React, { useState, useEffect } from "react";
import "../styles/calender.css";
const months = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = () => {
  const todayDate = new Date();

  // States
  const [today] = useState(todayDate);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [activeDay, setActiveDay] = useState(today.getDate());
  const [eventsArr, setEventsArr] = useState([]);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTimeFrom, setEventTimeFrom] = useState("");
  const [eventTimeTo, setEventTimeTo] = useState("");
  const [dateInput, setDateInput] = useState("");

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) setEventsArr(JSON.parse(storedEvents));
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(eventsArr));
  }, [eventsArr]);

  // Helper function to format time
  const convertTime = (time) => {
    let [hour, min] = time.split(":");
    hour = parseInt(hour);
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${min} ${period}`;
  };

  // Generate days for current month
  const generateDays = () => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    const days = [];

    // Previous month days
    for (let x = day; x > 0; x--) {
      days.push({ dayNum: prevDays - x + 1, type: "prev" });
    }

    // Current month days
    for (let i = 1; i <= lastDate; i++) {
      const event = eventsArr.some(
        (e) => e.day === i && e.month === month + 1 && e.year === year
      );
      let type = "";
      if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
        type = event ? "today active event" : "today active";
      } else if (event) {
        type = "event";
      } else {
        type = "";
      }
      days.push({ dayNum: i, type });
    }

    // Next month days
    for (let j = 1; j <= nextDays; j++) {
      days.push({ dayNum: j, type: "next" });
    }

    return days;
  };

  const days = generateDays();

  // Navigate months
  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  // Go to today
  const gotoToday = () => {
    setMonth(today.getMonth());
    setYear(today.getFullYear());
    setActiveDay(today.getDate());
  };

  // Go to custom date (MM/YYYY)
  const gotoDate = () => {
    const dateArr = dateInput.split("/");
    if (dateArr.length === 2) {
      const enteredMonth = parseInt(dateArr[0]);
      const enteredYear = parseInt(dateArr[1]);
      if (enteredMonth > 0 && enteredMonth < 13 && enteredYear.toString().length === 4) {
        setMonth(enteredMonth - 1);
        setYear(enteredYear);
        return;
      }
    }
    alert("Invalid date! Please enter in MM/YYYY format.");
  };

  // Add new event
  const handleAddEvent = () => {
    if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
      alert("Please fill all the fields");
      return;
    }

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    if (
      timeFromArr.length !== 2 ||
      timeToArr.length !== 2 ||
      timeFromArr[0] > 23 ||
      timeFromArr[1] > 59 ||
      timeToArr[0] > 23 ||
      timeToArr[1] > 59
    ) {
      alert("Invalid time format");
      return;
    }

    const newEvent = {
      title: eventTitle,
      time: `${convertTime(eventTimeFrom)} - ${convertTime(eventTimeTo)}`,
    };

    let added = false;
    const updatedEvents = [...eventsArr];
    updatedEvents.forEach((item) => {
      if (item.day === activeDay && item.month === month + 1 && item.year === year) {
        item.events.push(newEvent);
        added = true;
      }
    });

    if (!added) {
      updatedEvents.push({
        day: activeDay,
        month: month + 1,
        year,
        events: [newEvent],
      });
    }

    setEventsArr(updatedEvents);
    setShowAddEvent(false);
    setEventTitle("");
    setEventTimeFrom("");
    setEventTimeTo("");
  };

  // Delete event
  const handleDeleteEvent = (title) => {
    const updatedEvents = eventsArr.map((item) => {
      if (item.day === activeDay && item.month === month + 1 && item.year === year) {
        item.events = item.events.filter((e) => e.title !== title);
      }
      return item;
    }).filter((e) => e.events.length > 0);
    setEventsArr(updatedEvents);
  };

  // Get events for active day
  const activeEvents = eventsArr.find(
    (e) => e.day === activeDay && e.month === month + 1 && e.year === year
  )?.events || [];

  // Handle day click
  const handleDayClick = (dayObj) => {
    if (dayObj.type === "prev") {
      prevMonth();
    } else if (dayObj.type === "next") {
      nextMonth();
    }
    setActiveDay(dayObj.dayNum);
  };

  return (
    <div>
      <nav className="navbar">
        <a href="#" className="nav-logo">
          <i className="fa-solid fa-wrench"></i>
          Plan<span>Forge</span>
        </a>
        <div className="nav-links">
          <a href="main.html">Home</a>
        </div>
      </nav>

      <div className="container">
        {/* Left Calendar */}
        <div className="left">
          <div className="calender">
            <div className="month">
              <i className="fa fa-angle-left prev" onClick={prevMonth}></i>
              <div className="date">{months[month]} {year}</div>
              <i className="fa fa-angle-right next" onClick={nextMonth}></i>
            </div>
            <div className="weekdays">
              {["sun","mon","tue","wed","thur","fri","sat"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="days">
              {days.map((d, idx) => (
                <div
                  key={idx}
                  className={`day ${d.type}`}
                  onClick={() => handleDayClick(d)}
                >
                  {d.dayNum}
                </div>
              ))}
            </div>
            <div className="goto-today">
              <div className="goto">
                <input
                  type="text"
                  placeholder="mm/yyyy"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
                <button className="goto-btn" onClick={gotoDate}>go</button>
              </div>
              <button className="today-btn" onClick={gotoToday}>today</button>
            </div>
          </div>
        </div>

        {/* Right Events */}
        <div className="right">
          <div className="today-date">
            <div className="event-day">{new Date(year, month, activeDay).toString().split(" ")[0]}</div>
            <div className="event-date">{activeDay} {months[month]} {year}</div>
          </div>

          <div className="events">
            {activeEvents.length > 0 ? activeEvents.map((e, i) => (
              <div className="event" key={i} onClick={() => handleDeleteEvent(e.title)}>
                <div className="title">
                  <i className="fas fa-circle"></i>
                  <h3 className="event-title">{e.title}</h3>
                </div>
                <div className="event-time">
                  <span className="event-time">{e.time}</span>
                </div>
              </div>
            )) : <div className="no-event"><h3>No Events</h3></div>}
          </div>

          {/* Add Event Popup */}
          <div className={`add-event-wrapper ${showAddEvent ? "active" : ""}`}>
            <div className="add-event-header">
              <div className="title">Add Event</div>
              <i className="fas fa-times close" onClick={() => setShowAddEvent(false)}></i>
            </div>
            <div className="add-event-body">
              <div className="add-event-input">
                <input type="text" placeholder="Event Name" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
              </div>
              <div className="add-event-input">
                <input type="text" placeholder="Event Time From" value={eventTimeFrom} onChange={(e) => setEventTimeFrom(e.target.value)} />
              </div>
              <div className="add-event-input">
                <input type="text" placeholder="Event Time To" value={eventTimeTo} onChange={(e) => setEventTimeTo(e.target.value)} />
              </div>
            </div>
            <div className="add-event-footer">
              <button className="add-event-btn" onClick={handleAddEvent}>add event</button>
            </div>
          </div>
        </div>

        {/* Floating Add Button */}
        <button className="add-event" onClick={() => setShowAddEvent(!showAddEvent)}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
};

export default Calendar;
