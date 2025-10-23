import { Play } from 'lucide-react';
import React, { useState } from 'react';

const DateRangePicker = ({ onChange, initialStartDate, initialEndDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStart, setSelectedStart] = useState(initialStartDate ? new Date(initialStartDate) : null);
  const [selectedEnd, setSelectedEnd] = useState(initialEndDate ? new Date(initialEndDate) : null);
  const [isSelectingStart, setIsSelectingStart] = useState(true);

  // State untuk dropdown bulan & tahun
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Daftar bulan
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Daftar tahun (dari 2025 sampai 2040)
  const years = Array.from({ length: 16 }, (_, i) => 2025 + i); // 2025 - 2040

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDayClick = (day) => {
    if (!day) return;

    if (isSelectingStart) {
      setSelectedStart(day);
      setSelectedEnd(null);
      setIsSelectingStart(false);
    } else {
      if (day >= selectedStart) {
        setSelectedEnd(day);
        setIsSelectingStart(true);
        onChange({ startDate: selectedStart, endDate: day });
      } else {
        setSelectedStart(day);
        setSelectedEnd(selectedStart);
        setIsSelectingStart(true);
        onChange({ startDate: day, endDate: selectedStart });
      }
    }
  };

  const renderCalendar = (date) => {
    const days = getDaysInMonth(date);

    return (
      <div className="flex flex-col w-full">
        <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) return <div key={`empty-${index}`} className="h-8"></div>;

            const isToday = new Date().toDateString() === day.toDateString();
            const isSelectedStart = selectedStart && day.toDateString() === selectedStart.toDateString();
            const isSelectedEnd = selectedEnd && day.toDateString() === selectedEnd.toDateString();
            const isInRange = selectedStart && selectedEnd && day > selectedStart && day < selectedEnd;

            let className = "h-8 flex items-center justify-center text-sm rounded-md cursor-pointer transition-colors";

            if (isSelectedStart || isSelectedEnd) {
              className += " bg-primary text-white";
            } else if (isInRange) {
              className += " bg-primary opacity-50 text-white";
            } else if (isToday) {
              className += " border border-primary text-primary";
            } else {
              className += " hover:bg-gray-100 text-gray-700";
            }

            return (
              <div key={day.toISOString()} className={className} onClick={() => handleDayClick(day)}>
                {day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleMonthChange = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setShowMonthDropdown(false);
  };

  const handleYearChange = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearDropdown(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg z-20 absolute top-full left-0 mt-2 w-full">
      {/* Header dengan Dropdown Bulan & Tahun */}
      <div className="flex justify-between items-center mb-4 w-full">
        <button
          onClick={prevMonth}
          className="p-1 rounded hover:bg-gray-100 text-gray-600 border border-gray-400"
        >
          <Play className='w-4 h-4 rotate-180' />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md flex items-center space-x-1"
          >
            <span>{months[currentMonth.getMonth()]}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showMonthDropdown && (
            <div className="absolute left-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 text-gray-600">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthChange(index)}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    index === currentMonth.getMonth()
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md flex items-center space-x-1"
          >
            <span>{currentMonth.getFullYear()}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {showYearDropdown && (
            <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10 text-gray-500">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`block px-4 py-2 text-sm w-full text-left ${
                    year === currentMonth.getFullYear()
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={nextMonth}
          className="p-1 rounded hover:bg-gray-100 text-gray-600 border border-gray-400"
        >
          <Play className='w-4 h-4' />
        </button>
      </div>

      {/* Kalender Dua Bulan */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <div className="text-xs font-medium text-gray-500 mb-2">
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          {renderCalendar(currentMonth)}
        </div>
        <div className="w-1/2">
          <div className="text-xs font-medium text-gray-500 mb-2">
            {months[new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).getMonth()]} {new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1).getFullYear()}
          </div>
          {renderCalendar(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
        </div>
      </div>

      {/* Footer Button */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => {
            setSelectedStart(null);
            setSelectedEnd(null);
            setIsSelectingStart(true);
            onChange({ startDate: null, endDate: null });
          }}
          className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:text-gray-800"
        >
          Reset
        </button>
        <button
          onClick={() => {
            if (selectedStart && selectedEnd) {
              onChange({ startDate: selectedStart, endDate: selectedEnd });
            }
          }}
          disabled={!selectedStart || !selectedEnd}
          className={`px-3 py-1 text-sm text-white rounded ${
            selectedStart && selectedEnd ? 'bg-primary hover:opacity-90' : 'bg-primary opacity-50 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;