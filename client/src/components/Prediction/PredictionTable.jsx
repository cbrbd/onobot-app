import { useEffect, useState, useRef, useCallback } from "react"
import useWindowDimensions from "../tool/windowDimensions";
import { useNavigate } from "react-router-dom";
import { OnoStats } from "./OnoStats";
import { LoadingIcon } from "../General/Icons/LoadingIcon";
import { MagnifyingGlass } from "../General/Icons/MagnifyingGlass";


export function PredictionTable(props){

    const isPreview = props.isPreview;

    const navigate = useNavigate();
    const ref = useRef(null);

    const {height} = useWindowDimensions()


    const [data, setData] = useState(null);
    const [stats, setStats] = useState(null);
    const [count, setCount] = useState(0);
    const [isDataRemaining, setIsDataRemaining] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [displayData, setDisplayData] = useState(null);
    const [filter, setFilter] = useState('all');
    const [textFilter, setTextFilter] = useState('');
    const [textFilteredData, setTextFilteredData] = useState('');



    //filter with text input
    useEffect(()=>{
        if(!displayData){
            return
        }
        setTextFilteredData(displayData.filter(function(line){
            if(line.trueLabel !== undefined && line.predictedLabel !== undefined){
                return (line.trueLabel.includes(textFilter.toLowerCase()) || line.predictedLabel.includes(textFilter.toLowerCase()));
            }
            return 0
            
            // return line;
        }))
        // setTextFilteredData(displayData.filter(line=>line.trueLabel.includes(textFilter.toLowerCase()) ||  line.predictedLabel.includes(textFilter.toLowerCase())))
    }, [displayData, data, textFilter])


    //filter with radio
    useEffect(()=>{
        setDisplayData(data);
        switch(filter){
            case 'untagged':
                setDisplayData(data.filter(line=>line.success===undefined))
                break;
            case 'success':
                setDisplayData(data.filter(line=>line.success===true))
                break;
            case 'failed':
                setDisplayData(data.filter(line=>line.success===false))
                break;
            default:
                setDisplayData(data);
                break;
        }
    }, [data, filter])


    //fetch stats
    useEffect(()=>{
        async function loadStats(){
            try {
                const response = await fetch('/api/feedback/stats');
                const result = await response.json();
                setStats(result);
            } catch (error) {
                console.log("Error loading stats");
            }
        }
        loadStats();
        
    }, [])
  
    //fetch data
    useEffect(()=>{
        async function fetchLatestData(){
            try {
                setIsLoading(true);
                const batchSize = 10;
                const response = await fetch(`/api/feedback?page=0&batchSize=${batchSize}`);
                const result = await response.json();
                setData(result);
                setIsLoading(false);     
            } catch (error) {
                console.log("Error loading data");
            }
            
        }  

        async function fetchBatchData(){
            try {
                setIsLoading(true);
                const batchSize=20;
                const response = await fetch(`/api/feedback?page=${count}&batchSize=${batchSize}`);
                const result = await response.json();
                if(result.length < batchSize){
                setIsDataRemaining(false);
                }
                if(count === 0){
                setData(result);
                setIsLoading(false);
                }
                else {
                setData((data) => [...data, ...result]);
                setIsLoading(false);
                }
                if(ref.current && ref.current.offsetHeight < height && result.length === batchSize){
                    setCount(c => c +1);
                }
            } catch (error) {
                console.log("Error loading data")
            }
            
        }
        if(!isPreview){
            fetchBatchData();    
        } else {
            fetchLatestData();
        }
    }, [count, height, isPreview])



    const handleScroll = useCallback(function(e){
    const el = e.target.documentElement;
    const bottom = el.scrollHeight - el.scrollTop - 1 < el.clientHeight;
    if (bottom && isDataRemaining) {
        setCount(c => c +1);
        }
    }, [isDataRemaining])

    //check if page is fully scrolled
    useEffect(()=>{
        if(!isPreview){
            window.addEventListener('scroll',handleScroll);
            return(function(){
                window.removeEventListener("scroll", handleScroll)
            })
        }
        
    }, [handleScroll, isPreview])
    
      
    function handleLineClick(id){
        navigate(`/prediction/${id}`);
    }

    function handleEnterPress(e,id){
        if(e.key === "Enter"){
            handleLineClick(id);
        }
    }

    function handleLinkClick(e){
        e.stopPropagation();
    }

    function processClassname(success){
        if(success===undefined){
            return 'prediction-unknown';
        }
        if(success === true){
            return 'prediction-success';
        }
        if(success === false){
            return 'prediction-fail'
        }
    }   

    function handleTextChange(e){
        setTextFilter(e.target.value);
    }


    function handleRadioChange(e){
        setFilter(e.target.value)
    }
    

        return(
            <div 
                style={{display:"flex", flexDirection: "column", alignItems: "center", width:"100%"}}
            >
            
            
            {!props.isPreview && stats && stats.total!==0 && (
                <>
                    <OnoStats data={stats}/>
                    <div id="radio-group">
                        <div>
                            <input 
                                type="radio" 
                                value="all" 
                                id="all" 
                                checked={filter === 'all'} 
                                onChange={handleRadioChange}
                            />
                            <label htmlFor="all">Show all</label>
                        </div>
                        <div>
                            <input 
                                type="radio" 
                                value="success" 
                                id="success" 
                                checked={filter === 'success'} 
                                onChange={handleRadioChange}
                            />
                            <label htmlFor="success">Successful predictions</label>
                        </div>
                        
                        <div>
                            <input 
                                type="radio" 
                                value="failed" 
                                id="failed" 
                                checked={filter === 'failed'} 
                                onChange={handleRadioChange}
                            />
                            <label htmlFor="failed">Failed predictions</label>
                        </div>
                        <div>
                            <input 
                                type="radio" 
                                value="untagged" 
                                id="untagged" 
                                checked={filter === 'untagged'} 
                                onChange={handleRadioChange}
                            />
                            <label htmlFor="untagged">Untagged predictions</label>
                        </div>
                        
                        <div>
                            <span className="filter-text-group">
                                <MagnifyingGlass/> 
                                <input id="filter-text" type="text" value={textFilter} onChange={handleTextChange}/>
                                {!textFilter &&(
                                    <label htmlFor="filter-text">
                                        Search a genre
                                    </label>
                                )}
                            </span>
                        </div>
                        
                        
                    </div>
                </>
            )}
            {(!data || data.length === 0) && (
                <div className="error-message   ">Database is empty, process a song to fill it</div>
            )}
            
            {data && data.length !== 0  && displayData && textFilter === '' &&  (
                <div id="table-container" ref={ref}>
                <table id="prediction-table">
                    <thead>
                        <tr>
                            <th>Predicted label</th>
                            <th>True label</th>
                            <th>Song URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map(function(line, index){
                            processClassname(line.success);
                            return(
                                <tr 
                                    tabIndex="0"
                                    onKeyUp={(e)=>handleEnterPress(e, line._id)}
                                    onClick={()=>{handleLineClick(line._id)}}
                                    key={index + line._id}     
                                    className={processClassname(line.success)}
                                    id={index === data.length-1 ? 'last' : null}
                                >
                                    <td>{index+1} {line.predictedLabel}</td>
                                    <td>{line.trueLabel}</td>
                                    <td>
                                        <a 
                                            onClick={handleLinkClick}
                                            tabIndex="0"
                                            href={`https://www.youtube.com/watch?v=${line.videoID}`}
                                            target='_blank'
                                            rel="noreferrer"
                                            title={`https://www.youtube.com/watch?v=${line.videoID}`}
                                        >
                                            {line.videoID}
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {isLoading && <LoadingIcon/>}
                {!isDataRemaining && !isPreview &&(
                    <div style={{paddingTop:'1rem'}}>No more data to show</div>
                )}
            </div>
            )}

            {textFilter !== '' && textFilteredData.length === 0 && (
                <div>No data matching genre <strong>{textFilter}</strong></div>
            )}
            {data && displayData && textFilteredData.length!==0 && textFilter!=='' && (
                <div id="table-container" ref={ref}>
                    <table id="prediction-table">
                    <thead>
                        <tr>
                            <th>Predicted label</th>
                            <th>True label</th>
                            <th>Song URL</th>
                        </tr>
                    </thead>
                    <tbody>
                    {textFilter !== '' && textFilteredData.map(function(line, index){
                            processClassname(line.success);
                            return(
                                <tr 
                                    tabIndex="0"
                                    onKeyUp={(e)=>handleEnterPress(e, line._id)}
                                    onClick={()=>{handleLineClick(line._id)}}
                                    key={index + line._id}     
                                    className={processClassname(line.success)}
                                    id={index === data.length-1 ? 'last' : null}
                                >
                                    <td>{index+1} {line.predictedLabel}</td>
                                    <td>{line.trueLabel}</td>
                                    <td>
                                        <a 
                                            onClick={handleLinkClick}
                                            tabIndex="0"
                                            href={`https://www.youtube.com/watch?v=${line.videoID}`}
                                            target='_blank'
                                            rel="noreferrer"
                                            title={`https://www.youtube.com/watch?v=${line.videoID}`}
                                        >
                                            {line.videoID}
                                        </a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                    </table>
                </div>
            )}
            
            </div>
            
        )
    
    
}