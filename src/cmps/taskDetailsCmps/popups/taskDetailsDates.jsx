import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef } from "react";
import previousYearIcon from '../../../assets/imgs/icons/last_year.svg'
import previousMonthIcon from '../../../assets/imgs/icons/last_month.svg'
import nextYearIcon from '../../../assets/imgs/icons/next_year.svg'
import nextMonthIcon from '../../../assets/imgs/icons/next_month.svg'
import { popupToViewportHook } from '../../../customHooks/popupToViewportHook'
export function TaskDetailsDates({ board, groupId, taskId, onClose, onSave, dates, position }) {
    // single state object combining date and time
    const [dateTime, setDateTime] = useState(dates ? new Date(dates.dateTime) : new Date());
    const popupRef = useRef(null)

    //date:
    const handleDateInputChange = (e) => {  //2 way binding input to date
        const inputDate = e.target.value;
        const newDateTime = new Date(inputDate);
        if (!isNaN(newDateTime.getTime())) {
            // keep the current time, only update the date
            newDateTime.setHours(dateTime.getHours());
            newDateTime.setMinutes(dateTime.getMinutes());
            setDateTime(newDateTime);
        }
    };

    const formatDateForInput = (date) => {  //format the date - 2 way binding date to input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    //time:    
    const formatTimeForInput = (date) => {  //format the time in HH:mm format
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleTimeInputChange = (e) => {  //2 way binding input to time
        const timeValue = e.target.value; // format: "HH:mm"
        const [hours, minutes] = timeValue.split(':');
        const newDateTime = new Date(dateTime);
        newDateTime.setHours(parseInt(hours), parseInt(minutes));
        setDateTime(newDateTime);
  };

  // keep popup fully visible vertically
  popupToViewportHook(popupRef, position)

    const renderCustomHeader = ({
        date,
        decreaseMonth,
        increaseMonth,
        decreaseYear,
        increaseYear,
    }) => (
        <div className="react-datepicker__header">
            <div className="react-datepicker__current-month">
                <button type="button" className="react-datepicker__navigation react-datepicker__navigation--previous-year" onClick={decreaseYear}>
                    <img src={previousYearIcon} alt="previous year" />
                </button>
                <button type="button" className="react-datepicker__navigation react-datepicker__navigation--previous" onClick={decreaseMonth}>
                    <img src={previousMonthIcon} alt="previous month" />
                </button>
                <span>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</span>
                <button type="button" className="react-datepicker__navigation react-datepicker__navigation--next" onClick={increaseMonth}>
                    <img src={nextMonthIcon} alt="next month" />
                </button>
                <button type="button" className="react-datepicker__navigation react-datepicker__navigation--next-year" onClick={increaseYear}>
                    <img src={nextYearIcon} alt="next year" />
                </button>
            </div>
        </div>
    );

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div 
                ref={popupRef}
                className="popup-content popup-dates" 
                onClick={(e) => e.stopPropagation()}
                style={position ? {
                    top: `${position.top}px`,
                    left: `${position.left}px`
                } : {}}
            >
                <h4>Date</h4> <button className="popup-close" onClick={onClose}>×</button>
                <div className="popup-body">
                    <div className="custom-calendar">
                    <DatePicker
                        selected={dateTime}
                        onChange={(date) => setDateTime(date)}
                        inline
                        renderCustomHeader={renderCustomHeader}
                    />
                    </div>
                    <h6 className="date-time-title">Due date</h6>
                    <div className="date-time-container">
                        <div className="date-picker-container">
                            <input
                                type="date"
                                value={formatDateForInput(dateTime)}
                                onChange={handleDateInputChange}
                            />
                        </div>
                        <div className="time-picker-container">
                            <input
                                type="time"
                                value={formatTimeForInput(dateTime)}
                                onChange={handleTimeInputChange}
                            />
                        </div>
                    </div>
                    <button type="submit" onClick={() => onSave('dates', { dateTime })}>Save</button>
                    <button onClick={() => onSave('dates', null)}>Remove</button>
                </div>
            </div>
        </div>
    )
}

