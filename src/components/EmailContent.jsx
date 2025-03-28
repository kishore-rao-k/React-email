
function EmailContent({ eData,loading,error, favorites, addToFav }) {
  return (
    <div className="w-full p-6 pr-20 rounded-md border border-[#CFD2DC] bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {eData.fromName && (
            <div className="w-15 h-15 flex justify-center items-center text-2xl uppercase rounded-full bg-[#E54065] text-white font-bold">
              {eData.fromName.slice(0, 1)}
            </div>
          )}
          <div>
            {eData.subject && <div className="text-xl font-semibold ">{eData.subject}</div>}
            {eData.date && <div className="text-xs ">{new Date(eData.date).toLocaleString()}</div>}
          </div>
        </div>
        <button 
          className="px-4 py-2 bg-[#E54065] text-white rounded-3xl hover:bg-[#D12D52] transition"
          onClick={addToFav}
        >
          {favorites.includes(eData.id) ? "Unmark as Favorite" : "Mark as Favorite"}
        </button>
      </div>
      {loading ? (
  <div className="mt-6 ml-20 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
) : error ? <h1>{error}</h1> :(
  eData.body && (
    <div className="mt-6">
      <style>{`
        .email-content p {
          margin-bottom: 1rem;
          color: #636363;
        }
      `}</style>
      <div
        className="email-content text-sm whitespace-pre-wrap break-words ml-20"
        dangerouslySetInnerHTML={{ __html: eData.body }}
      />
    </div>
  )
)}
    </div>
  );
}

export default EmailContent