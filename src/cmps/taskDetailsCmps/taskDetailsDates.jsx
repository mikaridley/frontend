import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
export function TaskDetailsDates({ board, groupId, taskId, onClose, onSave, dates, position }) {
    // Single state object combining date and time
    const [dateTime, setDateTime] = useState(dates ? new Date(dates.dateTime) : new Date());

    //date:
    const handleDateInputChange = (e) => {  //2 way binding input to date
        const inputDate = e.target.value;
        const newDateTime = new Date(inputDate);
        if (!isNaN(newDateTime.getTime())) {
            // Keep the current time, only update the date
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
        const timeValue = e.target.value; // Format: "HH:mm"
        const [hours, minutes] = timeValue.split(':');
        const newDateTime = new Date(dateTime);
        newDateTime.setHours(parseInt(hours), parseInt(minutes));
        setDateTime(newDateTime);
    };

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div 
                className="popup-content popup-dates" 
                onClick={(e) => e.stopPropagation()}
                style={position ? {
                    top: `${position.top}px`,
                    left: `${position.left}px`
                } : {}}
            >
                <h4>Date</h4> <button className="popup-close" onClick={onClose}>×</button>
                <div className="popup-body">
                    <DatePicker
                        selected={dateTime}
                        onChange={(date) => setDateTime(date)}
                        inline
                    />
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
                    <button onClick={onClose}>Remove</button>
                </div>
            </div>
        </div>
    )
}

