import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ResponsiveContainer , BarChart , Bar, XAxis, YAxis } from 'recharts';

function App() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [adminDetails, setAdminDetails] = useState(null);
  const [SaveButtonEnabled,setSaveButtonEnabled] =useState(true);
  const [customAmount,setCustomAmount] =useState(10);
  const [regularAmounts, setRegularAmounts] = useState([79, 59, 39, 19]);

  const handleLogin = async () => {
    try {
      const data = { name, password };
      console.log(data);
      const url = 'https://stg.dhunjam.in/account/admin/login';
      const response = await axios.post(url, {
        "username": name,
        "password": password
      });
      if (response.status === 200) {
        setLoggedIn(true);
        FetchAdminDetails(response.data.data.id);
        console.log(response.data);
        console.log(response.data.data.id);
      } else {
        console.log("Error occured while fetching the admin data");
      }
    } catch (e) {
      console.log(e);
    }
  }
  const FetchAdminDetails = async (adminId) => {
    console.log(adminId);
    try {
      const url = 'https://stg.dhunjam.in/account/admin/' + adminId;
      const response = await axios.get(url);
      if (response.data.status === 200) {
        setAdminDetails(response.data.data);
        console.log(response.data.data);
        setCustomAmount(response.data.data.amount.category_6);
      } else {
        console.log("No Data");
      }
    } catch (e) {
      console.log(e);
    }
  }
  const handleCustomAmountChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setCustomAmount(value);
    setSaveButtonEnabled(value > 99);
  };
  const handleRegularAmountsChange = (event, index) => {
    const value = parseInt(event.target.value, 10);
    const updatedAmounts = [...regularAmounts];
    updatedAmounts[index] = value;
    setRegularAmounts(updatedAmounts);
    setSaveButtonEnabled(updatedAmounts.every(amount => amount > [79, 59, 39, 19][index]));
  };
  const handleSaveButtonClick=async()=>{
    try{
      const url = 'https://stg.dhunjam.in/account/admin/'+adminDetails.id ;
      const response = await axios.put(url,{
        amount :{
          category_6: customAmount,
          category_7: regularAmounts[0],
          category_8: regularAmounts[1],
          category_9: regularAmounts[2],
          category_10: regularAmounts[3],
        },
      });
      if(response.data.status === 200){
        FetchAdminDetails(adminDetails.id);
      }else{
        console.log("Error updating the prices");
      }
    }catch(e){
      console.log(e);
    }
  }
  const Array =[
    {
      name: "Custom",
      price: customAmount,
    },
    {
      name: "Caterogy1",
      price: regularAmounts[0],
    },
    {
      name: "Caterogy2",
      price: regularAmounts[1],
    },
    {
      name: "Caterogy3",
      price: regularAmounts[2],
    },
    {
      name: "Caterogy4",
      price: regularAmounts[3],
    }
  ]
  useEffect(()=>{

  },[loggedIn,adminDetails]);
  console.log(adminDetails);
  return (
    <div className="App">
      {!loggedIn && (
        <div className='login'>
          <div className='heading'>
            <label>Venue Admin Login</label>
          </div>
          <input className="_Name" type="text" placeholder="username" value={name} onChange={(e) => setName(e.target.value)}></input><br></br>
          <input className="_Name"type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></input><br></br>
          <button className="Sign"onClick={handleLogin}>Sign In</button><br></br>
          <a href='/' id='link'>New Registration?</a>
        </div>
      )}
      {loggedIn&&adminDetails&&(
        <div className='admin'>
          <div className='mainhead'>
            <h1>{adminDetails.name}</h1>
            <h1>{adminDetails.location}</h1> 
            <h1> on    Dhun Jam</h1>
          </div>
          <div className='req'>
            <div className='change1'>
              <label id='change'>Do you want to charge </label>
              <label id='change2'>your customers for requesting songs?</label>
            </div>
            <input 
            type="radio"
            id='yes'
            value="true"
            checked={adminDetails.charge_customers}
            onChange={()=>setSaveButtonEnabled(true)}
            />Yes
            <input 
            type="radio"
            id='No'
            value="false"
            checked={!adminDetails.charge_customers}
            onChange={()=>setSaveButtonEnabled(true)}
            />No
          </div>
          <div className='cust'>
            <label>Customer song request amount</label>
            <input            
                type="number"
                className="custom_amount"
                value={customAmount}
                onChange={handleCustomAmountChange}
                disabled={!adminDetails.charge_customers}/>
          </div>
          <div className='Regular'>
            <label className='reglabel'>Regular song requested amount , from high to low -</label>
            <div className='reginput'>
            {regularAmounts.map((amount , index)=>(
              <div className=""key={index}>
                <input
                    type="number"
                    className='reg'
                    name={`regular_amount_${index + 7}`}
                    value={amount}
                    onChange={(event) => handleRegularAmountsChange(event, index)}
                    disabled={!adminDetails.charge_customers}/>
              </div>
            ))}
            </div>
          </div>
          <div className='graph'>
            <ResponsiveContainer width={500}>
              <BarChart data={Array} width={100} height={700}>
                <XAxis dataKey="name" />
                <YAxis/>
                <Bar dataKey="price" barSize={30} fill='#F0C3F1'/>
              </BarChart >
            </ResponsiveContainer>
          </div>
          <div className='Save'>
            <button
              onClick={handleSaveButtonClick}
              disabled={!SaveButtonEnabled}
            >Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
