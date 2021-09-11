import React, { useEffect, useState, useContext, useCallback } from 'react';
import styles from './TableYear.module.css';
import axios from '../../axios';
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
    const [ networkError, setNetworkError ] = useState(false);

    const { setShowLoader } = useContext(LoaderContext);
    const { setMsg, setSuccess } = useContext(MessageContext);

    // const didMountRef = useRef(false);

    let { year, name } = props.formData;
    let { toggle } = props;
    // const { setDisplayName } = props;
    
    const updateTableHandler = useCallback( () => {
        console.log("update for year: ", year);
        if(networkError){
            setNetworkError(false);
        }
        setShowLoader(true);
        axios.get('/api/items', { params: { name: name, year: year } }) 
        .then(res => {
            console.log("table result: ", res)
            if(res.data[0]){
                setData(res.data[0].entries);
            }
            else if(res.data.message){
                setMsg("Unable to connect to the database"); // connection error from backend
                console.log("error in then is: ", res.data.message, year);
                setSuccess(false);
                setNetworkError(true);
            }
        })
        .catch(err =>{ 
            setMsg("Could not load data. Please check your network connection"); // axios timeout exceeded
            console.log("error in catch is: ", err, year);
            setSuccess(false);
            setNetworkError(true);
            // if(!err.message.includes("timeout")){
            //     console.log("timeout hit");
            //     setData([]);
            // }
        })
        .finally(() => {
            setShowLoader(false);
            // setDisplayName(name);
        });
    }, [ name, year, setMsg, setSuccess, setShowLoader, networkError ] )

    useEffect(() =>{
        if(data.length){
            setData([]);
        }
            updateTableHandler();
       
    },[name, year, toggle, updateTableHandler]) 

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
                                                        <EditButton   formData = {item} 
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

        console.log("data is: ", data);
    }, [data, name, year, updateTableHandler])

    return( data.length > 0 ?
        <Container fluid className="bg-light" >
            <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                <Col className={styles.year} >{ year }</Col>    
            </Row>
            {/* { networkError ? 
                <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                    <Col className={styles.networkError} >Network Error. Data could not be loaded for this year.</Col>    
                </Row> :<> */}
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
             {/* </> } */}
            
        </Container> : null
    );
}

export default React.memo(TableYear);