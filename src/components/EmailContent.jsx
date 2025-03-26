
function EmailContent({ eData, favorites, addToFav }) {
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
          className="px-4 py-2 bg-[#E54065] text-white rounded-3xl hover:bg-[#D12D52] transition"
          onClick={addToFav}
        >
          {favorites.includes(eData?.id) ? "Unmark as Favorite" : "Mark as Favorite"}
        </button>
      </div>
      {eData?.body  && (
        <div className="mt-6">
          <style>{`
            .email-content p {
              margin-bottom: 1rem;
              color: #636363;
            }
          `}</style>
          <div 
            className="email-content text-sm whitespace-pre-wrap break-words  ml-20"
            dangerouslySetInnerHTML={{ __html: eData.body }}
          />
        </div>
      )}
    </div>
  );
}

export default EmailContent