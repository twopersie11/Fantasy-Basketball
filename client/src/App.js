import {useEffect, useState} from 'react'
import axios from 'axios'

function App() {
  const [data, setData] = useState("")
  useEffect(() => {
    axios.get('/api/data').then(res => {setData(res.data.data)})
  }, [])
  return (
    <h1>
      NBA Fantasy Basketball Assistant
    </h1>
  );
}

export default App;
