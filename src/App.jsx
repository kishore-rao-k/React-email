import { useState, useEffect } from 'react';

function Card() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://flipkart-email-mock.vercel.app/');
        const eData = await response.json();
        setData(eData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  if (!data || !data.list) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {data.list.map((ele,index)=>(
        <div key={index} className='flex flex-row mt-3'>
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
      
    </div>
  )
}


function App() {
  return (
    <>
      <Card />
    </>
  );
}

export default App;
