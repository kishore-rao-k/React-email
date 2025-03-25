import { useState, useEffect } from 'react';

function Nav({ filterEmails }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white shadow-sm border-b border-[#CFD2DC]">
      <label className="text-[#636363] font-medium">Filter By:</label>
      <button 
        onClick={() => filterEmails('all')}
        className="px-4 py-2 rounded-md text-[#636363] bg-[#F4F5F9] border border-[#CFD2DC] hover:bg-[#1E4EA] hover:text-white transition"
      >
        Show All
      </button>
      <button 
        onClick={() => filterEmails('unread')}
        className="px-4 py-2 rounded-md text-[#636363] bg-[#F4F5F9] border border-[#CFD2DC] hover:bg-[#1E4EA] hover:text-white transition"
      >
        Unread
      </button>
      <button 
        onClick={() => filterEmails('read')}
        className="px-4 py-2 rounded-md text-[#636363] bg-[#F4F5F9] border border-[#CFD2DC] hover:bg-[#1E4EA] hover:text-white transition"
      >
        Read
      </button>
      <button 
        onClick={() => filterEmails('favorites')}
        className="px-4 py-2 rounded-md text-[#636363] bg-[#F4F5F9] border border-[#CFD2DC] hover:bg-[#1E4EA] hover:text-white transition"
      >
        Favorites
      </button>
    </div>
  );
}
function Card({ handleCardClick, emails, favorites }) {
  return (
    <div className="flex flex-col gap-4 p-6 bg-[#F4F5F9] rounded-lg">
      {emails.map((ele, index) => (
        <div
          key={index}
          className={`flex items-center p-4 border border-[#CFD2DC] rounded-lg shadow-sm hover:shadow-md transition cursor-pointer ${
            ele.read ? 'bg-[#2F2F2F] text-white' : 'bg-white'
          }`}
          onClick={() => handleCardClick(ele.id, ele.subject, ele.date, ele.from.name, ele)}
        >
          <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#E54065] text-white font-bold">
            {ele.from.name.slice(0, 1)}
          </div>
          <div className="ml-4 flex-grow">
            <div className={`font-semibold text-lg ${ele.read ? 'text-white' : 'text-[#636363]'}`}>
              {ele.from.name}
            </div>
            <div className={`text-sm ${ele.read ? 'text-gray-300' : 'text-[#636363]'}`}>
              {`<${ele.from.email}>`}
            </div>
            <div className={`mt-1 text-lg font-medium ${ele.read ? 'text-white' : 'text-[#636363]'}`}>
              {ele.subject}
            </div>
            <div className={`text-sm ${ele.read ? 'text-gray-300' : 'text-[#636363]'}`}>
              {ele.short_description}
            </div>
            <div className="flex items-center mt-1">
              <div className={`text-xs ${ele.read ? 'text-gray-400' : 'text-[#636363]'}`}>
                {new Date(ele.date).toLocaleString()}
              </div>
              {favorites.includes(ele.id) && (
                <span className="ml-2 text-xs text-[#E54065] font-semibold">
                  Favorite
                </span>
              )}
            </div>
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
            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-[#E54065] text-white font-bold">
              {eData.fromName.slice(0, 1)}
            </div>
          )}
          <div>
            {eData?.subject && <div className="text-xl font-semibold text-[#636363]">{eData.subject}</div>}
            {eData?.date && <div className="text-xs text-[#636363]">{new Date(eData.date).toLocaleString()}</div>}
          </div>
        </div>
        <button 
          className="px-4 py-2 bg-[#1E4EA] text-white rounded-md hover:bg-[#1E4EA]/90 transition"
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
    <div className="bg-[#F4F5F9] min-h-screen">
      <h1 className='flex justify-center text-4xl py-4 text-[#636363]'>Email</h1>
      <Nav filterEmails={filterEmails} />
      {!clicked || viewingFavorites ? (
        <Card handleCardClick={handleCardClick} emails={filteredEmails} favorites={favorites} />
      ) : (
        <div className="flex flex-1/3 flex-row bg-[#F4F5F9]">
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