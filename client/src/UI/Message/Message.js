import React, { useEffect, useRef, useState } from 'react';
import { Alert } from 'react-bootstrap';
import './Message.css';

const Message = (props) => {

    const { msg, success } = props;

    const [ show, setShow ] = useState(false);

    const isMounted = useRef(false);

    function closeHandler(){
        setShow(false);
    }

    useEffect(() => {

        if(isMounted.current){
            setShow(true);
            let timer = setTimeout(() => {
                closeHandler();
                clearTimeout(timer);
            }, 5000);
        }
        else{
            isMounted.current = true;
        }

    }, [msg])


    console.log("msg is: ", msg);

    return( show ?
        <div className="alertBox" >
            <Alert variant={ success ? "success" : "danger" } onClose={closeHandler} dismissible  >
                { msg }
            </Alert> 
        </div> 
        : null
         
    );
}

export default Message;