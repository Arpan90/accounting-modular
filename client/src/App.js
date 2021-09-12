import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Controls from './Components/Controls/Controls';
import React, { useEffect, useState } from 'react';
import TableYear from './Components/TableYear/TableYear';
import Loader from './UI/Loader/Loader';
import { LoaderContext } from './Contexts/LoaderContext';
import Message from './UI/Message/Message';
import { MessageContext } from './Contexts/MessageContext';
import axios from './axios';
import { 
        Row, 
        Col,
      } from 'react-bootstrap';

function App() {

  console.log("app hit");
  const [ formData, setFormData ] = useState( { name:"", year: "" } );
  const [ showLoader, setShowLoader ] = useState(false);
  const [ msg, setMsg ] = useState("");
  const [ success, setSuccess ] = useState(true);
  const [ dataAll, setDataAll ] = useState([]);
  const [ noData, setNoData ] = useState(false);

  const getAllDataHandler = (name, year) =>{
    console.log("getalldatahandler hit");
    if(dataAll.length > 0){
      console.log("culprit 2");
      setDataAll([]);
    }

    setShowLoader(true);

    axios.get('/api/items', { params: { name: name, year: year } })
           .then((res) =>{
             console.log("response is: ", res.data, name, year);
             if(Array.isArray(res.data)){
               let arrangedData = res.data;
                if(arrangedData.length){
                    arrangedData.sort((a, b) =>{
                    return -(Number(a.year) - Number(b.year));
                  });
                  setDataAll(arrangedData);
                }
                else{
                  setNoData(true);
                }
             }
             else if(res.data.message){
              setMsg("Could not load data. Please check your network connection"); // connection error from backend
              console.log("error in then is: ", res.data.message, year);
              setSuccess(false);
          }
           })
           .catch((err) =>{
              setMsg("Could not load data. Please check your network connection"); // axios timeout exceeded
              console.log("error in catch is: ", err, year);
              setSuccess(false);
           })
           .finally(()=>{
             setShowLoader(false);
           })
  };
  
  useEffect(() =>{
    console.log("formdata useeffect hit app.js")
    if(formData.year === 'all'){
      let { name, year } = formData;
      getAllDataHandler(name, year);
    }
    if(noData){
      setNoData(false);
    }
  }, [formData])

  useEffect(() => {
    console.log("dataAll is (app.js): ", dataAll);
  }, [dataAll])
 
  useEffect(() =>{
    console.log("msg useeffect app.js");
  }, [msg])

  useEffect(() =>{
    console.log("success useeffect app.js");
  }, [success])

  useEffect(() =>{
    console.log("showLoader useeffect app.js");
  }, [showLoader])

  const stateUpdateHandler = (val) => {
      console.log("stateupdatehandler app.js");
      setFormData(val);
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
            { formData.year === 'all'  ? 
              ! noData ?
              dataAll.map((item, index) =>{
                  return <TableYear key={index} formData={{...formData, year: item.year }}  dataAll={item.entries} />
                
              })
              : <Row className="pt-5 ps-5 pe-5  col-lg-11"  > 
                                    <Col className="noDataStyles" >No entries for this person.</Col>    
                                 </Row>

            : formData.year ? <TableYear formData={ formData }  /> : null
            }

        </LoaderContext.Provider>

      </MessageContext.Provider>
      
    </div>
  );
}

export default App;