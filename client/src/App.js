import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Controls from './Components/Controls/Controls';
import { useEffect, useState } from 'react';
import TableYear from './Components/TableYear/TableYear';
import Loader from './UI/Loader/Loader';
import { LoaderContext } from './Contexts/LoaderContext';
import Message from './UI/Message/Message';
import { MessageContext } from './Contexts/MessageContext';

function App() {
  console.log("app hit");
  const [ formData, setFormData ] = useState( { name:"", year: "" } );
  const [ toggle, setToggle ] = useState(false);
  const START_YEAR = 2015;
  const END_YEAR = 2025;
  const yearRange = Array(END_YEAR - START_YEAR + 1).fill().map((_, idx) => (START_YEAR + idx).toString()); 
  const [ year, setYear ] = useState([]);
  const [ showLoader, setShowLoader ] = useState(false);
  const [ msg, setMsg ] = useState("");
  const [ success, setSuccess ] = useState(true);
  // const [ displayName, setDisplayName ] = useState("");

  useEffect(() => {
    console.log("year in useeffect is: ", year);
  }, [year])


  const stateUpdateHandler = (val) => {
    if(JSON.stringify(val) === JSON.stringify(formData)){
      setToggle(prevState => !prevState);
      console.log("if hit");
    }
    else{
      if(val.year === "all"){
        console.log("elseif hit");
        setYear(yearRange);
      }
      else{
        console.log("else else hit");
        setToggle(prevState => !prevState);
        setYear([val.year]);
      }
      console.log("year: ", year);
      setFormData(val);
    }

    console.log("year is: ", year);
  }
  
  return (
    <div className="App"  >

      <Message msg={msg}
               setMsg={ setMsg }
               success={success} />

      <Loader show={showLoader} />

      <MessageContext.Provider value = {{ msg, success, setMsg, setSuccess }} >

        <LoaderContext.Provider value={{ showLoader, setShowLoader }}>

            <Controls setFormData = {stateUpdateHandler}  /> 
            <div className="nameStyle" >{ formData.name.toUpperCase() }</div>
            <> 
            { year.map((item, index) => {
                return <TableYear key={index} formData={{...formData, year: item }} toggle={toggle} />
            }) }
            </>

        </LoaderContext.Provider>

      </MessageContext.Provider>
      
    </div>
  );
}

export default App;