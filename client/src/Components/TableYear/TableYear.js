import React, { useEffect, useState, useCallback } from 'react';
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

    const { setShowLoader, setMsg, setSuccess, showLoader, success, setCount } = props;

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

    const updateTableHandler = useCallback((id, op, item ) =>{
        let temp = [];
        console.log("data updated1");
        switch(op){
            case 'del':
                console.log("data updated2");
                temp = data.filter((element, index) => element.id !== id );
                if(!temp.length){
                    console.log("test del");
                    if(props.dataAll){
                        setCount(prevState => prevState - 1);
                        if(!(props.count - 1)){
                            return;
                        }
                    }
                    else{
                        setNoData(true);
                    }
                }
                setMsg("Deletion successful !");
                setSuccess(true);
                console.log("data updated3");
                break;

            case 'edit':
                temp = data;
                temp[temp.findIndex((element)=> element.id === id)] = item;
                break;

            case 'add':
                temp = data;
                temp.push(item);
                if(temp.length === 1 && noData ){
                    setNoData(false);
                }
                break;

            default:
                break;
        }

        setData(temp);

    }, [data, noData, props.dataAll, setCount, setMsg, setSuccess, props.count ]);


    useEffect(() =>{

        const getDataHandler = () => {

            console.log("updateTableHandler hit");
            setShowLoader(true);
            axios.get('/api/items', { params: { name: name, year: year } }) 
            .then(res => {
                setShowLoader(false);
                console.log("table result: ", res);
                if(Array.isArray(res.data)){
                    if(res.data.length){
                        if(noData){
                            setNoData(false);
                        }
                        console.log("table updated");
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
        }

        if(props.dataAll){
            console.log("dataAll given");
            setData(props.dataAll);
            return;
        }

        getDataHandler();
       
    },[props.formData, props.dataAll, name, setMsg, setShowLoader, setSuccess, year, noData ]) 

    useEffect(() => {
        console.log("second effect");
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

    }, [data, name, year, updateTableHandler, noData, setMsg, setShowLoader, setSuccess, showLoader, success, dayWithMonthNameHandler]);

    return( data.length || (noData && !props.dataAll) ?
        <Container fluid className="bg-light" >
            {/* {
              data.length || (noData && !props.dataAll) ? */}
                <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                    <Col className={styles.year} >{ year }</Col>    
                 </Row> 
            {/* } */}
            
            { noData ? 
                <Row className="pt-5 ps-5 pe-5  col-lg-11"  >
                    <Col className={styles.noDataStyles} >No entries for this year.</Col>    
                    {/* <Col className={styles.noDataStyles} >{`No entries for this ${props.dataAll ? 'person' : 'year'}.`}</Col>     */}
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