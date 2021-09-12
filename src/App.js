import './App.scss';

import Game from './pages/Game/Game';

fetch('https://chess.apurn.com/nextmove', {
    method: 'POST',
    body: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR w'
}).then(res => {
  // console.log(res.text());
  return res.text();
}).then(data => console.log(data));

function App() {
  return <Game />;
}

export default App;
