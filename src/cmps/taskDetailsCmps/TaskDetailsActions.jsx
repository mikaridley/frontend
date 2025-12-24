import timeIcon from '../../assets/imgs/icons/time.svg'
import checkboxIcon from '../../assets/imgs/icons/checkbox.svg'
import memberIcon from '../../assets/imgs/icons/member.svg'
import attachmentIcon from '../../assets/imgs/icons/attachment.svg'

export function TaskDetailsActions({ onOpenPopup, members = [], labels = [], dates = null }) {
    return (
        <div className="task-details-actions">
            <button className="btn-add" onClick={(e) => onOpenPopup('add', e)}>+ Add</button>
            <button className="btn-attachments" onClick={(e) => onOpenPopup('attachments', e)}>
                <img src={attachmentIcon} alt="attachments" />
                Attachments
            </button>
            {!labels.length && (
                <button className="btn-labels" onClick={(e) => onOpenPopup('labels', e)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.5 12.5L12.5 20.5C12.1022 20.8978 11.5626 21.1213 11 21.1213H9C6.23858 21.1213 4 18.8827 4 16.1213V15.1213C4 14.5589 4.22351 14.0193 4.62132 13.6215L12.6213 5.62152C13.0191 5.22371 13.5587 5.00021 14.1211 5.00021C14.6835 5.00021 15.2231 5.22371 15.6209 5.62152L20.5 9.5C20.8978 9.89782 21.1213 10.4374 21.1213 11C21.1213 11.5626 20.8978 12.1022 20.5 12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="9" cy="16" r="1.5" fill="currentColor"/>
                    </svg>
                    Labels
                </button>
            )}
            <button className="btn-checklists" onClick={(e) => onOpenPopup('checklists', e)}>
                <img src={checkboxIcon} alt="checklists" />
                Checklists
            </button>
            {!members.length && (
                <button className="btn-members" onClick={(e) => onOpenPopup('members', e)}>
                    <img src={memberIcon} alt="members" />
                    Members
                </button>
            )}
            {!dates && (
                <button className="btn-dates" onClick={(e) => onOpenPopup('dates', e)}>
                    <img src={timeIcon} alt="dates" />
                    Dates
                </button>
            )}
        </div>
    )
}

