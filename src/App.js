import React, { useState, useEffect } from 'react';
import './App.css';
import { Fade } from 'react-awesome-reveal';
import logo from './raw.jpg'; 

function App() {
  const [data, setData] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [loading, setLoading] = useState(false); // state variable for loading status

  useEffect(() => {
    // Ange url till api:et
    const url = "https://manager.tickster.com/Statistics/SalesTracker/Api.ashx?keys=9KR9XX";

    // Använd fetch för att göra en GET-förfrågan adsda
    fetch(url)
      .then((response) => response.json()) // Konvertera svaret till json
      .then((data) => {
        setData(data);
        console.log(data);
        setLoading(false);
      })
      .catch((error) => console.error(error)); // Hantera eventuella fel
  }, []);

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
  <p>No data...</p>
 }

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='eventFeed'>
          {data ? <img src={logo} alt="logo" className='eventFeedLogo'/> : ''}
          
          {
            data ? data.map((item, index) => (
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
          ))
        :
        <div>
          <img src={logo} alt="logo" className="logo"/>  
          <p style={{color: 'fc0f17'}}>Loading</p>
        </div>
           
        }
          {!loading ? <p>Ingen data.</p> : ''}
        </div>
      </header>
    </div>
  );
}

export default App;
