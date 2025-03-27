function Card({ handleCardClick, emails, favorites, clickedId }) {
  return (
    <div className="flex flex-col p-5 gap-3">
      {emails.map((ele, index) => (
        <div
          key={index}
          className={`flex flex-row p-4 border-2 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${
            clickedId === ele.id 
              ? 'border-[#E54065] bg-white' 
              : 'border-[#CFD2DC]'
          } ${
            ele.read ? 'bg-white' : 'bg-[#f2f2f2]'
          }`}
          onClick={() => handleCardClick(ele.id, ele.subject, ele.date, ele.from.name, ele)}
        >
          <div className="mr-4">
            <div className="w-15 h-15 rounded-full text-xl bg-[#E54065] text-white font-bold uppercase flex justify-center items-center">
              {ele.from.name.slice(0, 1)}
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            <div className="font-semibold"> 
              From: <span className="font-bold">
                {ele.from.name.charAt(0).toUpperCase() + ele.from.name.slice(1)}
                {` <${ele.from.email}>`}
              </span>
            </div>
            <div className="font-semibold">Subject: <span className="font-bold">{ele.subject}</span></div>
            <div className="text-sm">{ele.short_description}</div>
            <div className='flex flex-row gap-4'> 
              <div className="text-xs mt-1">{new Date(ele.date).toLocaleString()}</div>
              {favorites.includes(ele.id) && (
                <span className="mt-1 text-xs text-[#E54065] font-semibold">Favorite</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Card;