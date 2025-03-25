import { useState, useEffect } from 'react';

function Nav({ filterEmails }) {
  return (
    <div className="flex items-center gap-4 p-4  border-b border-[#CFD2DC]">
      <label className=" font-medium">Filter By:</label>
      <button 
  onClick={() => filterEmails('all')}
  className="px-4 py-2 rounded-3xl  border border-transparent 
             hover:bg-[#E1E4EA] hover:border-[#CFD2DC]"
>
  Show All
</button>
      <button 
        onClick={() => filterEmails('unread')}
        className="px-4 py-2 rounded-3xl  border border-transparent 
             hover:bg-[#E1E4EA] hover:border-[#CFD2DC]"
      >
        Unread
      </button>
      <button 
        onClick={() => filterEmails('read')}
        className="px-4 py-2 rounded-3xl  border border-transparent 
             hover:bg-[#E1E4EA] hover:border-[#CFD2DC]"
      >
        Read
      </button>
      <button 
        onClick={() => filterEmails('favorites')}
        className="px-4 py-2 rounded-3xl  border border-transparent 
             hover:bg-[#E1E4EA] hover:border-[#CFD2DC]"
      >
        Favorites
      </button>
    </div>
  );
}

function Card({ handleCardClick, emails, favorites }) {
  return (
    <div className="flex flex-col gap-3 p-5">
      {emails.map((ele, index) => (
        <div
          key={index}
          className={`flex flex-row p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-[#CFD2DC] ${
            ele.read ?'bg-white' : ' bg-[#f2f2f2]'
          }`}
          onClick={() => handleCardClick(ele.id, ele.subject, ele.date, ele.from.name, ele)}
        >
          <div className="mr-4">
            <div className="w-15 h-15 rounded-full text-2xl bg-[#E54065] text-white font-bold uppercase flex justify-center items-center">
              {ele.from.name.slice(0, 1)}
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            <div className="font-semibold ">From: <span className="font-bold">{ele.from.name}</span></div>
            <div className="font-semibold ">Subject: <span className="font-bold">{ele.subject}</span></div>
            <div className="text-sm ">{ele.short_description}</div>
            <div className="text-xs  mt-1">{new Date(ele.date).toLocaleString()}</div>
            {favorites.includes(ele.id) && (
              <span className="mt-1 text-xs text-[#E54065] font-semibold">Favorite</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function EmailContent({ eData, loading, favorites, addToFav }) {
  return (
    <div className="w-full p-6 bg-white border border-[#CFD2DC] rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {eData?.fromName && (
            <div className="w-15 h-15 flex justify-center items-center text-2xl uppercase rounded-full bg-[#E54065] text-white font-bold">
              {eData.fromName.slice(0, 1)}
            </div>
          )}
          <div>
            {eData?.subject && <div className="text-xl font-semibold ">{eData.subject}</div>}
            {eData?.date && <div className="text-xs ">{new Date(eData.date).toLocaleString()}</div>}
          </div>
        </div>
        <button 
          className="px-4 py-2 bg-[#E54065] text-white rounded-md hover:bg-[#D12D52] transition"
          onClick={addToFav}
        >
          {favorites.includes(eData?.id) ? "Unmark as Favorite" : "Mark as Favorite"}
        </button>
      </div>
      {eData?.body && !loading && (
        <div className="mt-6">
          <style>{`
            .email-content p {
              margin-bottom: 1rem;
              color: #636363;
            }
          `}</style>
          <div 
            className="email-content text-sm whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: eData.body }}
          />
        </div>
      )}
    </div>
  );
}

function App() {
  const [emails, setEmails] = useState([]);
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [clickedId, setClickedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eData, setEData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [viewingFavorites, setViewingFavorites] = useState(false);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await fetch('https://flipkart-email-mock.vercel.app/emails');
        const data = await response.json();
        setEmails(data.list.map(email => ({ ...email, read: false, favorite: false })));
        setFilteredEmails(data.list);
      } catch (error) {
        console.error('Error fetching emails:', error);
      }
    };
    fetchEmails();
  }, []);

  function handleCardClick(id, subject, date, fromName, emailData) {
    setClicked(true);
    setClickedId(id);
    setLoading(true);
    setEData({ ...emailData, subject, date, fromName });

    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === id ? { ...email, read: true } : email
      )
    );

    const fetchEmailDetails = async () => {
      try {
        const response = await fetch(`https://flipkart-email-mock.vercel.app/?id=${id}`);
        const details = await response.json();
        setEData(prevState => ({ ...prevState, body: details.body }));
      } catch (error) {
        console.error('Error fetching email details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmailDetails();
  }

  const addToFav = () => {
    if (eData?.id) {
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

  return (
    <div className=" min-h-screen">
      <h1 className='flex justify-center text-4xl py-4 '>Email</h1>
      <Nav filterEmails={filterEmails} />
      {!clicked || viewingFavorites ? (
        <Card handleCardClick={handleCardClick} emails={filteredEmails} favorites={favorites} />
      ) : (
        <div className="flex flex-1/3 flex-row ">
          <div className="flex flex-col w-1/3">
            <Card handleCardClick={handleCardClick} emails={filteredEmails} favorites={favorites} />
          </div>
          <div className="flex flex-1 mt-5 rounded-md border border-[#CFD2DC] bg-white ml-4 mr-4">
            <EmailContent 
              eData={eData} 
              loading={loading} 
              favorites={favorites} 
              addToFav={addToFav} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;