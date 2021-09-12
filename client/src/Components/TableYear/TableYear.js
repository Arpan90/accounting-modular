import React, { useEffect, useState, useContext, useCallback } from 'react';
import styles from './TableYear.module.css';
import axios from '../../axios';
import AddButton from '../../UI/AddButton/AddButton';
import EditButton from '../../UI/EditButton/EditButton';
import DeleteButton from '../../UI/DeleteButton/DeleteButton';
import { LoaderContext } from '../../Contexts/LoaderContext';
import { MessageContext } from '../../Contexts/MessageContext';
import { Container, 
         Row, 
         Col,
         Table,
        } from 'react-bootstrap';

const TableYear = (props) => {
    
    const [ data, setData ] = useState([]);
    const [ incomingTableRow, setIncomingTableRow ] = useState(null);
    const [ outgoingTableRow, setOutgoingTableRow ] = useState(null);
    const [ incomingSum, setIncomingSum ] = useState(0);
    const [ outgoingSum, setOutgoingSum ] = useState(0);
    const [ noData, setNoData ] = useState(false);
    // const [ networkError, setNetworkError ] = useState(false);

    const { showLoader, setShowLoader } = useContext(LoaderContext);
    const { setMsg, setSuccess } = useContext(MessageContext);

    // const didMountRef = useRef(false);

    let { year, name } = props.formData;
    
    const updateTableHandler = useCallback( () => {
        console.log("updateHandler hit");
        setShowLoader(true);
        axios.get('/api/items', { params: { name: name, year: year } }) 
        .then(res => {
            console.log("table result: ", res, noData);
            if(Array.isArray(res.data)){
                if(res.data.length){
                    console.log("table updated");
                    setData(res.data[0].entries);
                    // if(noData){
                        // setNoData(false);
                    // }
                }
                else{
                    console.log("culprit nodata");
                    setNoData(true);
                }
            }
            // if(res.data[0]){
            //     setData(res.data[0].entries);
            // }
            else if(res.data.message){
                setMsg("Could not load data. Please check your network connection"); // connection error from backend
                console.log("error in then is: ", res.data.message, year);
                setSuccess(false);
            }
        })
        .catch(err =>{ 
            setMsg("Could not load data. Please check your network connection"); // axios timeout exceeded
            console.log("error in catch is: ", err, year);
            setSuccess(false);
        })
        .finally(() => {
            setShowLoader(false);
        });
    }, [ name, year, setMsg, setSuccess, setShowLoader ] )

    useEffect(() =>{

        if(props.dataAll){
            console.log("dataAll given")
            setData(props.dataAll);
            return;
        }

        if(noData){
            setNoData(false);
        }

        if(data.length){
            setData([]);
        }
        updateTableHandler();
       
    },[props.formData, updateTableHandler, props.dataAll]) 

    useEffect(() => {
        console.log("update for year in useeffect: ", year);
        let i = 0;
        let j = 0;
        let incomingSum = 0;
        let outgoingSum = 0;
        let incomingData = data.map((item, index) =>{
                                console.log("item: ", item)
                                if(item.direction === 'incoming'){
                                    i += 1;
                                    incomingSum += item.amount;
                                    item.year = year;
                                    item.name = name;
                                    return (
                                                <tr key = {index} >
                                                    <td>{ i }</td>
                                                    <td className={styles.narration} >{ item.narration }</td>
                                                    <td>{ item.amount }</td>
                                                    <td> 
                                                        <EditButton formData = {item} 
                                                                    toUpdate={ item.id }
                                                                    updateTableHandler={updateTableHandler} />

                                                        <DeleteButton formData = {item} 
                                                                    toUpdate={ item.id }
                                                                    updateTableHandler={updateTableHandler} />
                                                    </td>
                                                </tr>
                                            )
                                }
                                return null; 
                                
                            });

        let outgoingData = data.map((item, index) =>{
                                console.log("item: ", item)
                                if(item.direction === 'outgoing'){
                                    j += 1;
                                    outgoingSum += item.amount;
                                    item.year = year;
                                    item.name = name;
                                    return (
                                                <tr key = {index} >
                                                    <td>{ j }</td>
                                                    <td className={styles.narration} >{ item.narration }</td>
                                                    <td>{ item.amount }</td>
                                                    <td> 
                                                        <EditButton formData = {item} 
                                                                    toUpdate={ item.id }
                                                                    updateTableHandler={updateTableHandler} />
                                                                    
                                                        <DeleteButton formData = {item} 
                                                                    toUpdate={ item.id }
                                                                    updateTableHandler={updateTableHandler} />
                                                    </td>
                                                </tr>
                                            )
                                }
                                return null;
                                
                            });

        setIncomingTableRow(incomingData);
        setOutgoingTableRow(outgoingData);
        setIncomingSum(incomingSum);
        setOutgoingSum(outgoingSum);

        console.log("data is: ", data, noData);
    }, [data, name, year, updateTableHandler])

    useEffect(()=>{
        console.log("noData watch: ", noData);
    },[noData])

    useEffect(()=>{
        console.log("showLoader tableyear.js", year)
    }, [showLoader])

    return( data.length > 0 || noData ?
        <Container fluid className="bg-light" >
            <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                <Col className={styles.year} >{ year }</Col>    
            </Row>
            { noData ? 
                <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                    <Col className={styles.noDataStyles} >No entries for this year.</Col>    
                </Row> :<>
            <Row  className="ps-5 pe-5 col-lg-11">
                <Table striped bordered hover className={styles.tableWidth} >
                    <thead>
                        <tr>
                            <th  colSpan="4" >Incoming</th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Narration</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { incomingTableRow }
                        <tr>
                            <td colSpan="4" ><AddButton  formData = {{name: name, year: year, direction: "incoming" }} 
                                                         updateTableHandler={updateTableHandler} />
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Table striped bordered hover  className={styles.tableWidth} >
                    <thead>
                        <tr  >
                            <th  colSpan="4" >Outgoing</th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Narration</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { outgoingTableRow }
                        <tr>
                            <td colSpan="4" ><AddButton formData = {{name: name, year: year, direction: "outgoing" }} 
                                                        updateTableHandler={updateTableHandler} />
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
            <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                <Table striped bordered hover className={styles.tableWidth} >
                    <thead>
                        <tr>
                            <th>Total Incoming</th>
                            <th>Total Outgoing</th>
                            <th>Difference (I - O)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{ incomingSum }</td>
                            <td>{ outgoingSum }</td>
                            <td>{ incomingSum - outgoingSum }</td>
                        </tr>
                    </tbody>
                </Table>
            </Row>
             </> }
            
        </Container> : null
    );
}

export default TableYear;