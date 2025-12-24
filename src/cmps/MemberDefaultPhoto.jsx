import { getMemberInitials, getRandomColor } from '../services/util.service'

export function MemberDefaultPhoto({ size, memberName }) {
  const initials = getMemberInitials(memberName)
  return (
    <div
      style={{ width: size, height: size, backgroundColor: getRandomColor() }}
      className="member-default-photo"
    >
      {initials}
    </div>
  )
}
