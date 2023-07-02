import { useState, useEffect } from 'react';
// import { useEffect } from 'react';
import './App.css';

type PostgresResponse = {
  version: string;
};
function App() {
  const [data, setData] = useState();
  const [db, setDb] = useState<Array<PostgresResponse> | undefined>();
  const [test, setTest] = useState();

  console.log(import.meta.env.DEV);

  const URL = import.meta.env.DEV
    ? import.meta.env.VITE_DEV_PROXY_URL
    : import.meta.env.VITE_PROD_PROXY_URL;

  useEffect(() => {
    //get test data from '/'
    const getData = async () => {
      console.log("getting '/' data");
      const res = await fetch(`${URL}/`);
      const data = await res.json();
      console.log('data', data);
      setData(data);
    };
    getData();
    //get test data from '/db'
    const getDb = async () => {
      console.log("getting '/db' data");
      const res = await fetch(`${URL}/db`);
      const data = await res.json();
      console.log('data', data);
      setDb(data);
    };
    getDb();
    const getTest = async () => {
      console.log("getting '/test' data");
      const res = await fetch(`${URL}/test`);
      const data = await res.json();
      console.log('test', data);
      setTest(data);
    };
    getTest();
  }, [URL]);

  return (
    <div className='grid h-screen place-items-center'>
      <div>
        <p>from docker</p>
        <p>{data && data}</p>
        <p>{db && db[0].version.split(' ')[0]}</p>
        <p>{test && test}</p>
      </div>
    </div>
  );
}

export default App;
