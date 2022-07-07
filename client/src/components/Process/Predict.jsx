import {useState, useEffect, useMemo} from "react";

import { Histogram } from "../Charts/Histogram";
import { GenreRadarChart } from "../Charts/GenreRadarChart";
import { Modal } from "../General/Modal/Modal";
import { Toaster } from "../General/Toaster/Toaster";
import { LoadingIcon } from "../General/Icons/LoadingIcon";
import { ImprovementModalBody } from "./ImprovementModalBody";

import { PredictionTable } from "../Prediction/PredictionTable";


export function Predict(){

    const [youtubeURL, setYoutubeURL] = useState("");
    const [processedURL, setProcessURL] = useState("");
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalShowing, setShowModal] = useState(false);
    const [showToaster, setShowToaster] = useState(false);
    const [id, setId] = useState(null);

    useEffect(function(){
        let timer;
        if(showToaster){
            timer = setTimeout(function(){
                setShowToaster(false);
            }, 5000);
        }
        return(function(){
            window.clearTimeout(timer)
        })
    }, [showToaster])


    function toggleShowModal(){
        setShowModal(prev => !prev);
    }

    function handleValueChange(e){
        setYoutubeURL(e.target.value);
    }

    async function checkDB(videoID){
        try{
            const response = await fetch("/api/feedback/videoid/" + videoID);
            const dbData = await response.json();
            if(dbData.data.rawData.length !== 0){
                setData(dbData.data);
                setId((dbData._id));
                setLoading(false);
                return true;
            }
            return false;
        } catch(error){
            return false;
        }
    }

    async function saveData(newData, videoID){
        
        const newFeedback = {
            data: newData,
            predictedLabel: newData.higherGuess,
            videoID: videoID,
            trueLabel: undefined,
            success: undefined
        }
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFeedback)
        })
        const newID = await response.json();
        setId(newID);
    }
    
    async function submitLink(e){
        e.preventDefault();
        setLoading(true);
        setData(null);
        setProcessURL(youtubeURL);
        let videoID = "";
        if(youtubeURL.includes("watch?v=")){
            videoID = youtubeURL.split("&")[0].split('watch?v=')[1];
        }
        if(youtubeURL.includes("youtu.be")){
            videoID = youtubeURL.split("&")[0].split('youtu.be/')[1];
        }
        if(await checkDB(videoID) === true){
            return;
        }
        if(!(youtubeURL.includes("watch?v=") || youtubeURL.includes("youtu.be"))){
            setData({message: "invalid URL"});
            return
        }
        try{
            const response = await fetch("/api/ai/predict?url="+youtubeURL);
            const newData = await response.json();
            setData(newData);
            setLoading(false);
            saveData(newData, videoID);
        }
        catch(e){
            setData({message: "An error occured, please try again later"})
            setLoading(false);  
        }
    }


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const isButtonDisabled = useMemo(()=>{
        if(!(youtubeURL.includes("watch?v=") || youtubeURL.includes("youtu.be/"))){
            return true;
        } else {
            return false;
        }
    }, [youtubeURL])

    return(
    <div id="predict">

            <form>
                <input 
                    id="yt-link-input"
                    placeholder="youtube link" 
                    type="text" 
                    value={youtubeURL} 
                    onChange={handleValueChange}
                />
                <button 
                    id="process-link-btn"
                    type="submit" 
                    onClick={submitLink}
                    disabled={isButtonDisabled}
                >
                    Submit
                </button>
            </form>

                {/* Loading */}
                {loading && (
                    <div className="loading-container">
                        <LoadingIcon/>
                    </div>
                )}

                {!loading && !data && (
                    <PredictionTable isPreview={true}/>
                )}

                {/* Error */}
                {data && data.message!=="success" &&(
                    <div className="error-message">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM232 152C232 138.8 242.8 128 256 128s24 10.75 24 24v128c0 13.25-10.75 24-24 24S232 293.3 232 280V152zM256 400c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 385.9 273.4 400 256 400z"/>
                        </svg>
                        <span>{data.message}</span>
                    </div>
                )}

                {/* Data */}
                {data && data.message==="success" &&(
                <div id="prediction">
                        <div className="top">
                            <span>
                                is <strong>{data.higherGuess}</strong> a good guess ?
                            </span> 
                            <button onClick={toggleShowModal}>Help us improve</button>
                            <Modal 
                                isShowing={isModalShowing} 
                                toggleShow={toggleShowModal}
                                modalTitle="Help us improve"
                            >
                                <ImprovementModalBody 
                                    showAlert={()=>setShowToaster(true)} 
                                    guess={data.higherGuess} 
                                    toggleShow={toggleShowModal}
                                    url={processedURL}
                                    data={data}
                                    id={id}
                                />
                            </Modal>
                            <Toaster 
                                isShowing={showToaster}
                                message="Thanks for your feedbacks ❤️"
                                style={{backgroundColor:"#C3F3D7", border:"1px solid #2FD573"}}
                            />
                        </div>
                        <div className="top-left">
                            <ul>
                            {data.guess.map(function(genre, index){
                                return(
                                <li key={`genre-${index}`} className={`genre top-${index}`}>
                                    { capitalizeFirstLetter(genre.name)} {Math.round(10000*genre.count/data.total)/100}%
                                </li>
                                )
                            })}
                            </ul>
                            <div>
                                <img 
                                    className="genre-icon"
                                    src={`${process.env.PUBLIC_URL}/images/genres/${data.higherGuess}.svg`} 
                                    alt={data.higherGuess}
                                    title={data.higherGuess}
                                />
                                <div>{capitalizeFirstLetter(data.higherGuess)}</div>
                            </div>    
                            
                        </div>
                        <div className="top-right">
                             {/*Comes from radar Error: <path> attribute d: Expected number, "M NaN,NaNL NaN,NaN…". */}
                            <GenreRadarChart data={data}/>
                        </div>
                        <div className="bottom">
                            <Histogram rawData={data.rawData}/>
                        </div>

                
            </div>
            )}
    </div>
    )
}