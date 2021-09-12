import React, { useEffect, useState, useCallback } from 'react';
import styles from './Controls.module.css';
import { ExclamationIcon } from '../../UI/ExclamationIcon/ExclamationIcon';

import { 
    Container, 
    Row, 
    Col,
    ListGroup, 
    Button, 
    Modal, 
    Form 
} from 'react-bootstrap';
import axios from '../../axios';
import WithLoadingInfo from '../../HOC/WithLoadingInfo/WithLoadingInfo';

const Controls = (props) => {

    const { setShowLoader, setMsg, setSuccess } = props;

    const [ narrationValidationFail, setNarrationValidationFail ] = useState(false);
    const [ amountValidationFail, setAmountValidationFail ] = useState(false);

    const START_YEAR = 2015;
    const END_YEAR = 2025;

    let yearRange = Array(END_YEAR - START_YEAR + 1).fill().map((_, idx) => (START_YEAR + idx).toString() ); // generates an array of consecutive integers from START_YEAR to END_YEAR .

    const [ year, setYear ] = useState("all");
    const [ name, setName ] = useState("narayan");
    const [ direction, setDirection ] = useState("incoming");
    const [ amount, setAmount ] = useState("0");
    const [ narration, setNarration ] = useState('');  

    const [ blink , setBlink ] = useState(false);

    const users = ['narayan', 'savita', 'sakshi', 'arpan'];

    const [ searchStr, setSearchStr ] = useState('');

    const { setFormData } = props;

    const searchHandler = (event) =>{
        setSearchStr(event.target.value.toString().toLowerCase());
    }

    const setTableParametersHandler = useCallback( () =>{
        let formData = {
            name: name.toLowerCase(),
            year: year
        }
        setFormData(formData);
        setBlink(false);
    }, [ name, year, setFormData ] );

    useEffect(() => {
        setTableParametersHandler();
    }, [])

    const clickHandler = (event, id) => {
        switch(id){
            case "year":
                setYear(event.target.id);
                break;

            case "name":
                setName(event.target.id);
                break;

            case "direction":
                setDirection(event.target.id);
                break;

            default:
                return null;
        }

        setBlink(true);
    }

    const [show, setShow] = useState(false);

    const closeHandler = () => setShow(false);
    const showHandler = () => {
        setAmount(0);
        setNarration("");
        if(narrationValidationFail){
            setNarrationValidationFail(false);
        }
        if(amountValidationFail){
            setAmountValidationFail(false);
        }
        setShow(true);
    }

    const changeHandler = (event) => {

        switch(event.target.id){
            case "formBasicYear":
                setYear(event.target.value);
                break;

            case "formBasicName":
                setName(event.target.value);
                break;

            case "formBasicAmount":
                let val = event.target.value.toString();
                setAmount(val);
                break;

            case "formBasicNarration":
                setNarration(event.target.value);
                break;

            default:
                setDirection(event.target.id);
        }
    }

    const validationHandler = () =>{
            let yr = Number(year);
            if(users.includes(name) && Number.isInteger(yr) && (yr >= START_YEAR && yr <= END_YEAR) && Number(amount) > 0 && narration.trim() !== ""){
                if(amountValidationFail){
                    setAmountValidationFail(false);
                }
                if(narrationValidationFail){
                    setNarrationValidationFail(false);
                }
                return true;
            }
            if(Number(amount) <= 0 ){
                setAmountValidationFail(true);
            }
            else if(amountValidationFail){
                setAmountValidationFail(false);
            }
            if(narration.trim() === ""){
                setNarrationValidationFail(true);
            }
            else if(narrationValidationFail){
                setNarrationValidationFail(false);
            }
            return false;
    }

    const submitHandler = () =>{

        if(!validationHandler()){
            console.log("validation failed");
            return;
        }

        const formData = {
                name: name.toLowerCase(),
                year: year,
                amount: Number(amount),
                direction: direction,
                narration: narration
            }

            console.log("formData in controls = ", formData);
        
        setShowLoader(true);
        axios.post('/api/items', formData)
             .then((res => {
                console.log("control post successful");
                setTableParametersHandler();
                closeHandler();
                setBlink(false);
                setMsg("Entry added successfully !");
                setSuccess(true);
             }))
             .catch(err => {
                setMsg("Entry could not be added. Please check your network connection");
                setSuccess(false);
                 console.log('error is: ', err);
             })
             .finally(() => {
                 setShowLoader(false);
                });
    }

    return(
        <Container fluid="lg" className="p-5 bg-light" >
            <Row className={styles.rowHeight} >
                <Col lg={4} >
                    <ListGroup  >
                        <ListGroup.Item style={{postion: "fixed"}}  ><input type="text" onChange={searchHandler} value={searchStr} ></input></ListGroup.Item>
                    </ListGroup>
                    <ListGroup className={styles.colHeight} >
                        { "all".toString().includes(searchStr) ?
                        <ListGroup.Item key="all" id="all" action onClick={(event)=>clickHandler(event, "year")} variant="light" active={ year === "all" } >ALL  </ListGroup.Item>
                        : null }
                        {yearRange.map((yr, index)=>{
                            if(yr.toString().includes(searchStr)){
                                return <ListGroup.Item key={index} id={yr.toString()} action onClick={(event)=>clickHandler(event, "year")} variant="light" active={ year === yr.toString() } >{ yr }</ListGroup.Item>;
                            }
                            return null;
                        })} 
                    </ListGroup>
                </Col>

                <Col lg={4}>
                    <ListGroup >
                        <ListGroup.Item id='narayan' action variant="light" onClick={(event)=>clickHandler(event, "name")}  active={ name === 'narayan' } > Naryan</ListGroup.Item>
                        <ListGroup.Item id='savita' action variant="light" onClick={(event)=>clickHandler(event, "name")} active={ name === 'savita' } >Savita</ListGroup.Item>
                        <ListGroup.Item id='arpan' action variant="light" onClick={(event)=>clickHandler(event, "name")} active={ name === 'arpan' } >Arpan</ListGroup.Item>
                        <ListGroup.Item id='sakshi' action variant="light" onClick={(event)=>clickHandler(event, "name")} active={ name === 'sakshi' } >Sakshi</ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col lg={4}>
                    <ListGroup >
                        <ListGroup.Item id="incoming" action variant="light" onClick={(event)=>clickHandler(event, "direction")}  active={ direction === 'incoming' } >Incoming</ListGroup.Item>
                        <ListGroup.Item id="outgoing" action variant="light" onClick={(event)=>clickHandler(event, "direction")}  active={ direction === 'outgoing' } >Outgoing</ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>
            <Row >
                <Button variant="outline-secondary" size='lg' onClick={setTableParametersHandler} className={[styles.button, ( blink ? styles.blink : "")].join(" ")} >Get Data</Button>
                <Button variant="outline-secondary" size='lg' onClick={showHandler} disabled={ year === "all" } className={[styles.button, (year === "all" ? styles.notAllowed : "")].join(" ")} >Enter New Data</Button> 
            </Row>



                <Modal show={show} onHide={closeHandler} className={styles.modal}  >
                    <Modal.Header closeButton>
                    <Modal.Title>New Data Form</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicYear"> 
                                <Form.Label>Year</Form.Label>
                                <Form.Control type="number" defaultValue={year} disabled />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" defaultValue={name.toUpperCase()} disabled  />
                            </Form.Group>

                            <Form.Group controlId="incoming" >
                                <Form.Label>Type</Form.Label>
                                <Form.Check name="direction" type="radio" label="Incoming" checked={direction === "incoming"} onChange={changeHandler} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="outgoing" >
                                <Form.Check name="direction" type="radio" label="Outgoing" checked={direction === "outgoing"} onChange={changeHandler} />
                            </Form.Group>  

                            <Form.Group className="mb-3" controlId="formBasicAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="number" placeholder="Enter amount" onChange={changeHandler} value={Number(amount)} />
                                { amountValidationFail ? <div className={styles.validationFail} ><span> { ExclamationIcon } </span><span> Amount must be greater than zero </span> </div> : null }
                            </Form.Group> 

                            <Form.Group className="mb-3" controlId="formBasicNarration">
                                <Form.Label>Narration</Form.Label>
                                <Form.Control as="textarea" placeholder="Enter narration" onChange={changeHandler} value={narration} />
                                { narrationValidationFail ? <div className={styles.validationFail} ><span> { ExclamationIcon } </span><span>Narration must contain some descriptive text</span></div> : null }
                            </Form.Group> 
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={closeHandler}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={submitHandler}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Container>
    );
}

export default WithLoadingInfo(React.memo(Controls));