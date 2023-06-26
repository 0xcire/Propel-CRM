import { useState, useEffect } from 'react';
import '@/App.css';

function App() {
  const [message, setMessage] = useState();

  useEffect(() => {
    //get test data from '/'
    const getData = async () => {
      console.log('getting data');
      const res = await fetch('http://localhost:1337/');
      const data = await res.json();
      setMessage(data);
    };
    getData();
  }, []);

  return (
    <div className='grid h-screen place-items-center'>
      <p>{message}</p>
    </div>
  );
}

export default App;
