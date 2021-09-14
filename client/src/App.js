import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Controls from './Components/Controls/Controls';
import React, { useEffect, useRef, useState } from 'react';
import TableYear from './Components/TableYear/TableYear';
import WithLoadingInfo from './HOC/WithLoadingInfo/WithLoadingInfo';
import axios from './axios';
import { 
        Row, 
        Col,
      } from 'react-bootstrap';

function App(props) {

  console.log("app hit");
  const [ formData, setFormData ] = useState( { name:"", year: "" } );
  const [ dataAll, setDataAll ] = useState([]);
  const [ noData, setNoData ] = useState(false);

  const dataTracker = useRef(false);

  const { setShowLoader, setMsg, setSuccess, showLoader, msg, success } = props;
  
  useEffect(() =>{

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
                    if(noData){
                      setNoData(false);
                    }
                    dataTracker.current = true;
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

    if(dataTracker.current){
      dataTracker.current = false;
      return;
    }
    console.log("formdata useeffect hit app.js")
    if(formData.year === 'all'){
      let { name, year } = formData;
      getAllDataHandler(name, year);
    }
  }, [formData, setMsg, setSuccess, setShowLoader, noData, dataAll])

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
      
    </div>
  );
}

export default WithLoadingInfo(App);