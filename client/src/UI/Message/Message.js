import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import './Message.css';

const Message = (props) => {

    const { msg, success, setMsg } = props;

    function closeHandler(){
        setMsg("");
    }

    useEffect(() => {
        if(msg){
            let timer = setTimeout(() => {
                setMsg("");
                clearTimeout(timer);
            }, 5000);
        }
    }, [msg, setMsg])

    console.log("msg is: ", msg);

    return( msg ?
        <div className="alertBox" >
            <Alert variant={ success ? "success" : "danger" } onClose={closeHandler} dismissible  >
                { msg }
            </Alert> 
        </div> 
        : null
         
    );
}

export default Message;