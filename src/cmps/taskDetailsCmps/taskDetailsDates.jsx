import DatePicker from "react-datepicker";
import { useState } from "react";
export function TaskDetailsDates({ board, groupId, taskId, onClose,onSave }) {
    const [startDate, setStartDate] = useState(new Date());


    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h4>Date</h4> <button className="popup-close" onClick={onClose}>X</button>
                <div className="popup-body">
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <button onClick={() => onSave('dates', { startDate })}>Save</button>
                    <button onClick={onClose}>Remove</button>
                </div>
            </div>
        </div>
    )
}

