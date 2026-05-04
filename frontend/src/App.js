import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import LoginForm from './components/LoginForm';
import StatusBoard from './components/StatusBoard';
import './App.css';

// initialiser connexion socket
const socket = io('http://localhost:3001');

// app principale - gère login et affichage du board
function App() {
  const [myName, setMyName] = useState('');
  const [members, setMembers] = useState([]);
  const [history, setHistory] = useState([]);
  const [broadcasts, setBroadcasts] = useState([]);

  useEffect(() => {
    // écouter les mises à jour du serveur
    socket.on('members:update', (updatedMembers) => {
      setMembers(updatedMembers);
    });

//
    socket.on('history:update', (entries) => {
      setHistory(entries);
    });

    ///
    socket.on('broadcast:message', (msg) => {
      setBroadcasts(prev => [...prev, msg]);
    });

    return () => {
      socket.off('members:update');
      socket.off('history:update');
      socket.off('broadcast:message');
    };
  }, []);

  if (!myName) {
    return <LoginForm socket={socket} onJoin={setMyName} />;
  }

  return (
    <StatusBoard
      socket={socket}
      myName={myName}
      members={members}
      history={history}
      broadcasts={broadcasts}
    />
  );
}

export default App;