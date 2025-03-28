import { useState, useEffect } from 'react';

import Nav from './components/Nav';
import Card from './components/Card';
import EmailContent from './components/EmailContent';

function App() {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [clickedId, setClickedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eData, setEData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewingFavorites, setViewingFavorites] = useState(false);
  const [error, setError] = useState(null);

  function handleCardClick(id, subject, date, fromName, emailData) {
    setClicked(true);
    setClickedId(id);
    
    setEData({ ...emailData, subject, date, fromName });

    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === id ? { ...email, read: true } : email
      )
    );

      const fetchEmailDetails = async () => {
        try {
          setLoading(true);
          const response = await fetch(`https://flipkart-email-mock.vercel.app/?id=${id}`);
          const details = await response.json();
          setEData(prevState => ({ ...prevState, body: details.body }));
        } catch (error) {
          setError('Error fetching email details');
        }  finally {
          setLoading(false);
        }
      };
      fetchEmailDetails();
    

  }

  const addToFav = () => {
    if (eData.id) {
      setFavorites(prev =>
        prev.includes(eData.id)
          ? prev.filter(favId => favId !== eData.id)
          : [...prev, eData.id]
      );
    }
  };

  function filterEmails(filterType) {
    if (filterType === 'unread') {
      setFilteredEmails(emails.filter(email => !email.read));
      setViewingFavorites(false);
    } else if (filterType === 'read') {
      setFilteredEmails(emails.filter(email => email.read));
      setViewingFavorites(false);
    } else if (filterType === 'favorites') {
      setFilteredEmails(emails.filter(email => favorites.includes(email.id)));
      setViewingFavorites(true);
      setClicked(false);
    } else {
      setFilteredEmails(emails);
      setViewingFavorites(false);
    }
  }

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('https://flipkart-email-mock.vercel.app/emails');
        const data = await response.json();
        setEmails(data.list);
        setFilteredEmails(data.list);
      } catch (error) {
        setError('An error occurred while fetching emails');
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);
  


  
  return  error ? (<h1 className='mt-20'>{error}</h1>) :(
    <div className=" min-h-screen">
      <Nav filterEmails={filterEmails} />
      {!clicked || viewingFavorites ? (
  <Card 
    handleCardClick={handleCardClick}  emails={filteredEmails} favorites={favorites} clickedId={clickedId}/>
  ) :(
  <div className="flex flex-1/3 flex-row">
    <div className="flex flex-col w-1/3">
      <Card handleCardClick={handleCardClick} emails={filteredEmails} favorites={favorites} clickedId={clickedId}/>
    </div>
          <div className="flex flex-1 rounded-md border border-[#CFD2DC] bg-white m-5 ml-3">
            <EmailContent 
              eData={eData} 
              loading={loading} 
              favorites={favorites} 
              error={error}
              addToFav={addToFav} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;