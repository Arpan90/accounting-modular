import React, { useEffect, useState  } from 'react';
import styles from './EditButton.module.css';
import axios from '../../axios';
import { ExclamationIcon } from '../ExclamationIcon/ExclamationIcon';
import {   
        Form,
        Button,
        Popover,
        OverlayTrigger
    } from 'react-bootstrap';

const EditButton = ( props ) => {
    
    const { name, year, amount, narration, direction } = props.formData;  

    const [ newNarration, setNarration ] = useState();
    const [ newAmount, setAmount ] = useState();
    const [ newDirection, setDirection ] = useState();

    const [ narrationValidationFail, setNarrationValidationFail ] = useState(false);
    const [ amountValidationFail, setAmountValidationFail ] = useState(false);

    const [ updated, setUpdated ] = useState(false);

    const hidePopoverHandler = () =>{
        document.body.click();
    }

    const { showLoader, setShowLoader, success, setMsg, setSuccess } = props; 

    useEffect(() => {
        if(!showLoader && success ){
            hidePopoverHandler();
        }
    }, [showLoader, success] )

    const resetHandler = () => {
        if(updated){
            setUpdated(false);
            return;
        }
        setAmount(amount);
        setNarration(narration);
        setDirection(direction);

        if(narrationValidationFail){
            setNarrationValidationFail(false);
        }
        if(amountValidationFail){
            setAmountValidationFail(false);
        }
    }

    function validationHandler(){
        console.log("validationhandler hit");
        if(newAmount > 0 && newNarration.trim() !== ""){
            console.log("validation successful");
            if(amountValidationFail){
                setAmountValidationFail(false);
            }
            if(narrationValidationFail){
                setNarrationValidationFail(false);
            }
            return true;
        }
        if(Number(newAmount) <= 0 ){
            console.log("amount validation fail");
            setAmountValidationFail(true);
        }
        else if(amountValidationFail){
            setAmountValidationFail(false);
        }
        if(newNarration.trim() === ""){
            console.log("narration error hit")
            setNarrationValidationFail(true);
        }
        else if(narrationValidationFail){
            setNarrationValidationFail(false);
        }
        return false;
    }

    const updateHandler = (event) => {

        event.preventDefault();

        if(!validationHandler()){
            return;
        }

        let newFormData = {
                name: name,
                year: year,
                narration: newNarration,
                amount: newAmount,
                direction: newDirection,
            }

        // props.setShowLoader(true);
        setShowLoader(true);
        
        axios.post(`/api/items/${props.toUpdate}`, newFormData )
             .then((res) =>{
                console.log(res); 
                props.updateTableHandler();
                setMsg("Updation successful !");
                setSuccess(true);
                setUpdated(true);
            })
             .catch(err => {
                setMsg("Updation failed. Please check your network connection")
                setSuccess(false);
                console.log(err);
             })
             .finally(() =>{
                // props.setShowLoader(false);
                setShowLoader(false);
              });
    }

    const changeHandler = (event) => {

        switch(event.target.id){

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

    const popover = (
        <Popover id="popover-basic" className={styles.popover}>
          <Popover.Header as="h3">Edit form</Popover.Header>
          <Popover.Body>
           <Form onSubmit={updateHandler} >
                <Form.Group controlId="incoming" >
                    <Form.Label>Type</Form.Label>
                    <Form.Check name="direction" type="radio" label="Incoming" checked={newDirection === "incoming"} onChange={changeHandler} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="outgoing" >
                    <Form.Check name="direction" type="radio" label="Outgoing" checked={newDirection === "outgoing"} onChange={changeHandler} />
                </Form.Group>  

                <Form.Group className="mb-4" controlId="formBasicAmount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="number" placeholder="Enter amount" onChange={changeHandler} value={Number(newAmount)} />
                    { amountValidationFail ? <div className={styles.validationFail} ><span> { ExclamationIcon } </span><span> Amount must be greater than zero </span> </div> : null }
                </Form.Group> 

                <Form.Group className="mb-3" controlId="formBasicNarration">
                    <Form.Label>Narration</Form.Label>
                    <Form.Control as="textarea" placeholder="Enter narration" onChange={changeHandler} value={newNarration} />
                    { narrationValidationFail ? <div className={styles.validationFail} ><span> { ExclamationIcon } </span><span>Narration must contain some descriptive text</span></div> : null }
                </Form.Group> 
                <Button type="submit" className={styles.buttonGrp}  variant='success' onClick={updateHandler} >Update</Button>
                <Button className={ [ styles.buttonGrp, styles.buttonCancel ].join(" ") } onClick={hidePopoverHandler} variant='danger' >Cancel</Button>
            </Form>
          </Popover.Body>
        </Popover>
      );

    return(
        <OverlayTrigger
            trigger="click"
            rootClose={!showLoader} 
            transition 
            placement="right" 
            onToggle={resetHandler}
            overlay={popover} >

            <Button className={styles.button} variant='primary' >Edit</Button>

        </OverlayTrigger>
    );

      
   
}

export default EditButton;