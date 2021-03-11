import './App.css';
import Cloud from "./components/Cloud/Cloud";

function App() {
  return (
    <div className="App">
      <Cloud coordinates={{x: 250, y: 200}} />
    </div>
  );
}

export default App;
