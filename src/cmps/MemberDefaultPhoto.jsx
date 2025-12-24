import { getMemberInitials, getRandomColor } from '../services/util.service'

export function MemberDefaultPhoto({ size, memberName }) {
  const initials = getMemberInitials(memberName)
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className="member-default-photo"
    >
      {initials}
    </div>
  )
}
