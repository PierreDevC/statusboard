import { useState } from 'react';
import MemberCard from './MemberCard';

// couleurs pour les différents statuts
const STATUS_COLORS = {
  'En ligne': '#22c55e', // vert
  'Absent':   '#eab308', // jaune
  'Occupé':   '#ef4444', // rouge
};

function StatusBoard({ socket, myName, members, history, broadcasts }) {
  const [broadcastText, setBroadcastText] = useState('');

  // envoyer le message a tous
  const sendBroadcast = () => {
    if (!broadcastText.trim()) return;
    socket.emit('broadcast:message', { text: broadcastText });
    setBroadcastText('');
  };

  // Compter les statuts
  const statusCounts = {};                                                                                                         
                                                                                                                                   
  for (let member of members) {                                                                                                    
    const status = member.status;                                                                                                  
                                                                                                                                   
    if (statusCounts[status]) {
      statusCounts[status] = statusCounts[status] + 1;
    } else {                                                                                                                       
      statusCounts[status] = 1;
    }                                                                                                                              
  }                    

  return (
    <div className="board-layout">
      {/* Barre a cote*/}
      <aside className="sidebar">
        <h3>STATUTS</h3>
        {['En ligne', 'Absent', 'Occupé'].map((status) => (
          <div key={status} className="status-count">
            <span style={{ color: STATUS_COLORS[status] }}></span>
            <span>{status}</span>
            <span className="count">{statusCounts[status] || 0}</span>
          </div>
        ))}
        
        {/*historiq */}
        {history.length > 0 && (
          <>
            <h3 style={{ marginTop: '24px' }}>HISTORIQUE</h3>
            <ul className="history-list">
              {history.map((entry, index) => (
                <li key={index}>
                  {entry}
                  {/* af ajou heure */}
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>

      {/* Main*/}
      <main className="board-main">
        <header className="board-header">
          <h1>
            StatusBoard{' '}
            <span className="online-badge">{members.length} en ligne</span>
          </h1>
          <span className="connected-as">Connecté : {myName}</span>
        </header>

        <h2>Membres connectés</h2>
        <div className="members-grid">
          {members.map((member) => (
            <MemberCard
              key={member.socketId}
              member={member}
              isMe={member.name === myName}
              socket={socket}
            />
          ))}
        </div>

        {/* Bonus 2 : message broadcast */}
        <div className="broadcast-section">
          <h3>Message global</h3>
          <div className="broadcast-input">
            <input
              value={broadcastText}
              onChange={(e) => setBroadcastText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendBroadcast()}
              placeholder="Envoyer un message à tous..."
            />
            <button onClick={sendBroadcast}>Envoyer</button>
          </div>
          {broadcasts.length > 0 && (
            <div className="broadcasts-list">
              <h4>Messages</h4>
              {broadcasts.map((msg, index) => (
                <div key={index} className="broadcast-message">
                  <strong>{msg.author}</strong>
                  <span className="message-time">{msg.timestamp}</span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default StatusBoard;