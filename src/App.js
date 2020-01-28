import React from "react";
import logo from "./logo.svg";
import "./App.css";
import socketIOClient from "socket.io-client";

function App() {
  const [name, changeName] = React.useState("Jack");
  const [gripStrength, setGripStrength] = React.useState(0);
  React.useEffect(() => {
    const socket = socketIOClient("/ping");
    console.log("we are in use effect");
    socket.on("emg", data => console.log("Data in use effect is", data));
  }, []);
  console.log("The data is", gripStrength);
  return (
    <div className="App">
      <button onClick={() => changeName("Tony")}>Click</button>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1> {gripStrength} </h1>
      </header>
    </div>
  );
}

export default App;
