import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { PropTypes } from "prop-types";

import "./modal.css"

export function Modal(props){

    useEffect(()=>{
        if(props.isShowing){
            const close = (e) => {
                if(e.keyCode === 27){
                    props.toggleShow()
                }
            }
            window.addEventListener('keydown', close)
            return () => window.removeEventListener('keydown', close)
        }
    })

    if(props.isShowing){

        return ReactDOM.createPortal(
        <>
          <div onClick={props.toggleShow} className="modal-overlay">
            <div className="modal-wrapper">
              <div className="modal" onClick={(e)=>e.stopPropagation()}>
                <div className="modal-header">
                  <h4>{props.modalTitle}</h4>
                  <button
                    type="button"
                    className="modal-close-button"
                    onClick={props.toggleShow}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                    {props.children}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
        )
    } 
    return null;
}

Modal.propTypes = {
  toggleShow: PropTypes.func,
  isShowing: PropTypes.bool,
  modalTitle: PropTypes.string,
  children: PropTypes.element
}