import { useState, useEffect } from 'react';

function Card({handleCardClick}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://flipkart-email-mock.vercel.app/');
        const eData = await response.json();
        setData(eData.list);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {data.map((ele,index)=>(
        <div key={index} className='flex flex-row mt-3 p-4 border border-gray-400' onClick={()=>handleCardClick(ele.id)}>
          <div className=' ml-5 mr-5 mb-10'>
          <div className='w-[50px] h-[50px] rounded-full bg-[#e54065] text-white font-bold uppercase flex justify-center items-center'>
            {ele.from.name.slice(0, 1)} </div>
          </div>
          <div>
          <div>From: {ele.from.name} {`<${ele.from.email}>`}</div>
        <div>Subject: { ele.subject}</div>
       <div>{ele.short_description}</div>
       <div>{new Date(ele.date).toLocaleString()}</div>
          </div>
       
       </div>
      ))}
      
    </>
  )
}


function App() {
  const [eData, setEData] = useState([]);
  const [clicked, setClicked] = useState(false); 
  function handleCardClick(id){
    // console.log("card is clicked : ",id); 
    setClicked(true);
      const fetchData = async () => {
        try {
          const response = await  fetch(`https://flipkart-email-mock.vercel.app/?id=${id}`)
          const eDescription = await response.json();
          setEData(eDescription.body);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
     
    };
    
  return (
    <>
     {!clicked ?(
     <Card handleCardClick ={handleCardClick} />
      ) :(
        <div className='flex flex-row'>
      <div className='flex flex-1/3 flex-col'><Card handleCardClick ={handleCardClick} /> </div>
      <div className='flex justify-center'>
  <div className='bg-gray-100 p-4 rounded-md shadow-lg max-w-4xl w-full'>
    <pre className='text-sm text-gray-800 whitespace-pre-wrap break-words'>{JSON.stringify(eData, null, 2)}</pre>
  </div>
</div>
    </div>)}
    </>
  );
}

export default App;
