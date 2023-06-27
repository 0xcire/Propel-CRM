import { useState, useEffect } from 'react';
import '@/App.css';

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    //get test data from '/'
    const getData = async () => {
      console.log('getting data');
      const res = await fetch('http://localhost:1337/');
      const data = await res.json();
      console.log(data);
      setData(data);
    };
    getData();
  }, []);

  return (
    <div className='grid h-screen place-items-center'>
      <div>
        <p>{data && data[0]}</p>
        <p>{data && `and, from ${data[1][0].version.split(' ')[0]}`}</p>
      </div>
    </div>
  );
}

export default App;
