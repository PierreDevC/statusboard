// couleurs des statuts
const STATUS_COLORS = {
  'En ligne': '#22c55e', // vert
  'Absent':   '#eab308', // jaune
  'Occupé':   '#ef4444', // rouge
};

// carte pour chaque membre
function MemberCard({ member, isMe, socket }) {
  // mettre a jour le statut quand l'utilisateur clique
  const handleStatusChange = (status) => {
    socket.emit('status:change', { status });
  };

  return (
    <div className={`member-card ${isMe ? 'is-me' : ''}`}>
      <div className="member-avatar">
        {member.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="member-info">
        <span className="member-name">
          {member.name} {isMe && <span className="badge-you">vous</span>}
        </span>
        <span className="member-role">{isMe ? 'Vous' : 'Membre'}</span>
        <span
        className="member-status"
        style={{ color: STATUS_COLORS[member.status] }}
        >
        {member.status}
        </span>
        {/* Boutons pour changer le statut*/}
        {isMe && (
          <div className="status-buttons">
            {['En ligne', 'Absent', 'Occupé'].map((status) => ( // parcourir avec map
              <button
                key={status}
                className={`btn-status ${member.status === status ? 'active' : ''}`}
                style={member.status === status ? { borderColor: STATUS_COLORS[status], color: STATUS_COLORS[status] } : {}}
                onClick={() => handleStatusChange(status)}
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberCard;