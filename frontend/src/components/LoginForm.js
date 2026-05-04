import { useState } from 'react';

// page de connexion
function LoginForm({ socket, onJoin }) {
  const [name, setName] = useState('');

  // envoyer le message de connexion au serveur
  const handleSubmit = () => {
    if (!name.trim()) return; // verifie si le nom est la
    socket.emit('user:join', { name });
    onJoin(name);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">S</div>
        <h1>StatusBoard</h1>
        <p>Entrez votre nom pour rejoidre</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Votre nom"
        />
        <button onClick={handleSubmit}>Rejoindre</button>
      </div>
    </div>
  );
}

export default LoginForm;