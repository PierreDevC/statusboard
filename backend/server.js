const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// initialiser l'app
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: ['http://localhost:3000', 'https://statusboard-five.vercel.app']
}));

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://statusboard-five.vercel.app'],
    methods: ['GET', 'POST']
  }
});


// variable qui contient les membres
const membres = {};

// variable qui contient l'historique evenement, barre a gauche
const historique = [];

// compter le nombre de membres avec Objectvalues
function broadcastMembers() {
  io.emit('members:update', Object.values(membres));
}



// creer la connection
io.on('connection', (socket) => {
  console.log('Nouvelle connexion :', socket.id);

  // Envoyer l'état actuel au nouveau venu
  // TODO: tester ca
  socket.emit('members:update', Object.values(membres));
  socket.emit('history:update', historique);


  // changer le status
  socket.on('status:change', ({ status }) => {
    if (membres[socket.id]) {
      const name = membres[socket.id].name;
      membres[socket.id].status = status;
      addHistory(`${name} → ${status}`);
      broadcastMembers();
    }
  });

  // joindre La salle
  socket.on('user:join', ({ name }) => {
    membres[socket.id] = { name, status: 'En ligne', socketId: socket.id };
    addHistory(`${name} a rejoint le board`);
    broadcastMembers();
  });






  // se decconecter
  socket.on('disconnect', () => {
    if (membres[socket.id]) {
      addHistory(`${membres[socket.id].name} a quitte le board`);
      delete membres[socket.id];
      broadcastMembers();
    }
  });

  socket.on('broadcast:message', ({ text }) => {
    if (membres[socket.id]) {
      const message = {
        author: membres[socket.id].name,
        text,
        timestamp: new Date().toLocaleTimeString('fr-FR')
      };
      io.emit('broadcast:message', message);
    }
  });
})

function addHistory(message) {
  historique.push(message);
  io.emit('history:update', historique);
}


// port backend
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur ecoute sur le port ${PORT}`);
});