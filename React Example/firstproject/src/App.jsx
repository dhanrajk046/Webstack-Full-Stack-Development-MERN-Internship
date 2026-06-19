import { useState } from "react";
import StudentCard from "./Components/StudentCard"; // (or any other imports you have)
import Header from "./Components/Header";
import "./App.css";

function App() {
  // Your useState hook will now work correctly here
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <StudentCard name="John" course="MERN Stack" />
      <StudentCard name="Max" course="JS" />
      <StudentCard name="Alice" course="HTML CSS" />
    </>
  );
}

export default App;
