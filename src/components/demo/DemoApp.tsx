import ShadowComponent from './ShadowComponent.tsx';
import ChatIcon from './ChatIcon.tsx';
import './demo.css';
import { Button } from '../ui/button.tsx';
import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const styles = `
  h3 { color: green; }
  .shadow-style {
    color: red;
    font-size: 20px;
  }
`;
  return (
    <>
      <div>

        <ChatIcon themeColor={'#77d916'}/>


        <h3>Main app h3</h3>

        <Button onClick={() => setCount(count + 1)}>Increment</Button>
        <p>Count: {count}</p>
        <ShadowComponent>
          <style>{styles}</style>
          <h3>subapp h3: inside Shadow DOM1</h3>
        </ShadowComponent>
      </div>
    </>
  );
}

export default App;
