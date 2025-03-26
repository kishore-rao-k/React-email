function Nav({ filterEmails }) {
    return (
      <div className="flex items-center gap-4 px-6 py-3 border-[#CFD2DC]">
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

  export default Nav