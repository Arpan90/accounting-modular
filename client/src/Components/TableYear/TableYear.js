import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from './TableYear.module.css';
import axios from '../../axios';
import AddButton from '../../UI/AddButton/AddButton';
import EditButton from '../../UI/EditButton/EditButton';
import DeleteButton from '../../UI/DeleteButton/DeleteButton';
import WithLoadingInfo from '../../HOC/WithLoadingInfo/WithLoadingInfo';
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

    const dataTracker = useRef(false);

    const { setShowLoader, setMsg, setSuccess, showLoader, success } = props;

    let { year, name } = props.formData;

    const dayWithMonthNameHandler = useCallback( (dbDate) =>{
        const MONTHS = {
            "01": "Jan",
            "02": "Feb",
            "03": "Mar",
            "04": "Apr",
            "05": "May",
            "06": "Jun",
            "07": "Jul",
            "08": "Aug",
            "09": "Sep",
            "10": "Oct",
            "11": "Nov",
            "12": "Dec"
        };
        Object.freeze(MONTHS);
        let breakdown = dbDate.split("-")
        return `${breakdown[0]}-${MONTHS[breakdown[1]]}`;
    }, []);
    
    const updateTableHandler = useCallback( () => {

        if(data.length){
            dataTracker.current = true; // will be turned false in useEffect after it prevents the useeffect from updating data or running updateTableHandler again.
            setData([]);                // The above will be turned false before it is turned true again in the following axios async function.
        }

        console.log("updateTableHandler hit");
        setShowLoader(true);
        axios.get('/api/items', { params: { name: name, year: year } }) 
        .then(res => {
            setShowLoader(false);
            console.log("table result: ", res);
            if(Array.isArray(res.data)){
                if(res.data.length){
                    console.log("table updated");
                    dataTracker.current = true;
                    setData(res.data[0].entries);
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
        .catch(err =>{ 
            setShowLoader(false);
            setMsg("Could not load data. Please check your network connection"); // axios timeout exceeded
            console.log("error in catch is: ", err, year);
            setSuccess(false);
        })
        // .finally(() => {
        //     setShowLoader(false);
        // });
    }, [ name, year, setMsg, setSuccess, setShowLoader, data ] )


    useEffect(() =>{

        if(props.dataAll){
            console.log("dataAll given")
            if(dataTracker.current){
                dataTracker.current = false;
                return;
            }
            setData(props.dataAll);
            return;
        }
        console.log("control hit")
        if(dataTracker.current){
            dataTracker.current = false;
            return;
        }

        console.log("test");
        updateTableHandler();
       
    },[props.formData, updateTableHandler, props.dataAll ]) 

    useEffect(() => {
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
                                                    <td className={styles.date} >{ dayWithMonthNameHandler(item.date) }</td>
                                                    <td className={styles.narration} >{ item.narration }</td>
                                                    <td>{ item.amount }</td>
                                                    <td className={styles.actions} > 
                                                        <EditButton formData = {item} 
                                                                    toUpdate={ item.id }
                                                                    showLoader={ showLoader }
                                                                    setShowLoader={setShowLoader}
                                                                    setMsg={setMsg}
                                                                    setSuccess={setSuccess}
                                                                    success={success}
                                                                    updateTableHandler={updateTableHandler} />

                                                        <DeleteButton   formData = {item} 
                                                                        toUpdate={ item.id }
                                                                        showLoader={ showLoader }
                                                                        setShowLoader={setShowLoader}
                                                                        setMsg={setMsg}
                                                                        setSuccess={setSuccess}
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
                                                    <td>{ dayWithMonthNameHandler(item.date) }</td>
                                                    <td className={styles.narration} >{ item.narration }</td>
                                                    <td>{ item.amount }</td>
                                                    <td className={styles.actions} > 
                                                        <EditButton formData = {item} 
                                                                    toUpdate={ item.id }
                                                                    showLoader={ showLoader }
                                                                    setShowLoader={setShowLoader}
                                                                    setMsg={setMsg}
                                                                    setSuccess={setSuccess}
                                                                    success={success}
                                                                    updateTableHandler={updateTableHandler} />
                                                                    
                                                        <DeleteButton   formData = {item} 
                                                                        toUpdate={ item.id }
                                                                        showLoader={ showLoader }
                                                                        setShowLoader={setShowLoader}
                                                                        setMsg={setMsg}
                                                                        setSuccess={setSuccess}
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

        if(noData && data.length){
            setNoData(false);
        }

    }, [data, name, year, updateTableHandler, noData, setMsg, setShowLoader, setSuccess, showLoader, success, dayWithMonthNameHandler]);


    useEffect(()=>{
        console.log("updatetablehandler effect");
    }, [updateTableHandler]);

    useEffect(()=>{
        console.log("mounted")
    }, [])

    return( data.length > 0 || (noData && !props.dataAll) ?
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
                            <th  colSpan="5" >Incoming</th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Narration</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { incomingTableRow }
                        <tr>
                            <td colSpan="5" >       <AddButton     
                                                            formData = {{name: name, year: year, direction: "incoming" }} 
                                                            showLoader={ showLoader }
                                                            setShowLoader={setShowLoader}
                                                            setMsg={setMsg}
                                                            setSuccess={setSuccess}
                                                            success={success}
                                                            updateTableHandler={updateTableHandler} />
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Table striped bordered hover  className={styles.tableWidth} >
                    <thead>
                        <tr  >
                            <th  colSpan="5" >Outgoing</th>
                        </tr>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Narration</th>
                            <th>Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { outgoingTableRow }
                        <tr>
                            <td colSpan="5" >        <AddButton     
                                                            formData = {{name: name, year: year, direction: "outgoing" }} 
                                                            showLoader={ showLoader }
                                                            setShowLoader={setShowLoader}
                                                            setMsg={setMsg}
                                                            setSuccess={setSuccess}
                                                            success={success}
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

export default WithLoadingInfo(React.memo(TableYear));