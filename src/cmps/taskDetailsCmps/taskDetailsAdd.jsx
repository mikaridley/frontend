import timeIcon from '../../assets/imgs/icons/time.svg'
import checkboxIcon from '../../assets/imgs/icons/checkbox.svg'
import memberIcon from '../../assets/imgs/icons/member.svg'
import attachmentIcon from '../../assets/imgs/icons/attachment.svg'
import imageIcon from '../../assets/imgs/icons/image_icon.svg'

export function TaskDetailsAdd({ board, groupId, taskId, onClose, onSave }) {
    const icons = {
        dates: <img src={timeIcon} alt="dates" />,
        checklists: <img src={checkboxIcon} alt="checklists" />,
        members: <img src={memberIcon} alt="members" />,
        attachments: <img src={attachmentIcon} alt="attachments" />,
        CUSTOM: <img src={imageIcon} alt="custom" />,
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h4>Add to card</h4> <button className="popup-close" onClick={onClose}>X</button>
                <div className="popup-body">
                    <button onClick={() => onOpen('labels')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.5 12.5L12.5 20.5C12.1022 20.8978 11.5626 21.1213 11 21.1213H9C6.23858 21.1213 4 18.8827 4 16.1213V15.1213C4 14.5589 4.22351 14.0193 4.62132 13.6215L12.6213 5.62152C13.0191 5.22371 13.5587 5.00021 14.1211 5.00021C14.6835 5.00021 15.2231 5.22371 15.6209 5.62152L20.5 9.5C20.8978 9.89782 21.1213 10.4374 21.1213 11C21.1213 11.5626 20.8978 12.1022 20.5 12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="9" cy="16" r="1.5" fill="currentColor"/>
                        </svg>
                        Labels
                    </button>
                    <button onClick={() => onOpen('dates')}>
                        {icons.dates}
                        Dates
                    </button>
                    <button onClick={() => onOpen('checklists')}>
                        {icons.checklists}
                        Checklists
                    </button>
                    <button onClick={() => onOpen('members')}>
                        {icons.members}
                        Members
                    </button>
                    <button onClick={() => onOpen('attachments')}>
                        {icons.attachments}
                        Attachments
                    </button>
                    <button onClick={() => onOpen('CUSTOM')}>
                        {icons.CUSTOM}
                        Custom Fields
                    </button>
                </div>
            </div>
        </div>
    )
}

