import React, { useState, useEffect } from 'react';
import './App.css';
import { Fade } from 'react-awesome-reveal';

function App() {
  const [data, setData] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [inputData, setInputData] = useState('');
  const [loading, setLoading] = useState(false); // state variable for loading status
  const [apiKey, setApiKey] = useState('9KR9XX');

  console.log(loading);
  const handleInput = (e) => {
    console.log(e.target.value);
    const newInput = e.target.value.toUpperCase();
    setInputData(newInput);
    setApiKey(newInput);
    console.log('detta är ' + apiKey);
  };

  const saveInput = () => {
    setLoading(true);
    const url = `https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey}`;
    console.log(url);

    fetch(
      `https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=${apiKey}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        // Spara data i local storage -
        localStorage.setItem('cachedData', JSON.stringify(data));
        console.log(data);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  };

  const handleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  function formatTime(timeStr) {
    const date = new Date(timeStr);
    const isoString = date.toISOString();
    const formattedDate = isoString.substring(0, 10);
    const formattedTime = isoString.substring(11, 16);
    return formattedDate + ' ' + formattedTime;
  }

  if (!data) {
    return (
      <div className='keyInput'>
        <h3>Salestrackernyckel:</h3>
        <input
          type='text'
          value={inputData}
          onChange={handleInput}
          placeholder='T ex 12345'
        />
        <button onClick={saveInput}>Hämta</button>
      </div>
    );
  }

  // Räkna ut hur många tickets som scannats
  const totalScannedTickets = data.reduce((acc, item) => {
    console.log(acc);

    if (item.gfs && item.gfs.entrd) {
      return acc + item.gfs.entrd;
    }
    return acc;
  }, 0);

  if (!data) {
    return (
      <div className='keyInput'>
        <h3>Salestrackernyckel:</h3>
        <input
          type='text'
          value={inputData}
          onChange={handleInput}
          placeholder='T ex 12345'
        />
        <button onClick={saveInput}>Hämta</button>
      </div>
    );
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='eventFeed'>
          <div className='keyInput'>
            <h3>Salestrackernyckel:</h3>
            <input
              type='text'
              value={inputData}
              onChange={handleInput}
              placeholder='T ex 12345'
            />
            <button onClick={saveInput}>Hämta</button>
          </div>
          {data.map((item, index) => (
            <Fade>
              <div
                className={`eventCard ${
                  index === expandedIndex ? 'transition' : ''
                }`}
                key={item.erc}
                loading='lazy'
              >
                <div className='eventInfo' key={item.erc}>
                  <h3 className='eventName'>{item.name}</h3>
                  <h4>Start: {formatTime(item.startLocal)}</h4>
                  <h4>Stad: {item.ven.city}</h4>
                 
                  {item.gfs
                    .filter(ticket => ticket.type === 7 || ticket.name === 'Showbiljett') // filter out tickets that have type 1
                    .map(ticket => ( // map over the filtered tickets
                     <div className='ticketInfo'>
                      <p><b>{ticket.name + ': '}</b></p>
                      <p>Totalt antal:  <b>{ticket.soldQtyNet}</b></p>
                     </div>                        
                    ))}

                    <p><b>Total kapacitet:</b> {item.sales.totCapacity}</p>
                    <p><b>Sålda biljetter:</b> {item.sales.soldQtyNet}</p>
                    <p><b>Sålda biljetter idag:</b> {item.rate.today}</p>
                    <p><b>
                      Biljetter kvar att sälja:{' '}
                      {item.sales.totCapacity - item.sales.soldQtyNet === '0'
                        ? 'Slutsålt'
                        : item.sales.totCapacity - item.sales.soldQtyNet}
                    </b></p>


                  <button onClick={() => handleExpand(index)}>
                    {index === expandedIndex ? 'Dölj info' : 'Mer info'}
                  </button>
                  <img src={item.img.thumb} alt={item.name} />
                  <div className='scannedTickets'>
                    
                  </div>
                </div>
              </div>
            </Fade>
          ))}
          {!loading ? <p>Ingen data.</p> : ''}
        </div>
      </header>
    </div>
  );
}

export default App;
