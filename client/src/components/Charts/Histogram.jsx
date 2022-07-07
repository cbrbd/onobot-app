import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function CustomTooltip({active, payload, label, genres}){
    if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p>Time: {formatTime(label)}</p>
            <p>Genre: {genres[payload[0].value]}</p>
          </div>
        );
}
}

function formatTime(value){
        let minutes = Math.floor(value/60);
        let seconds = Math.floor(value%60);
        if(seconds < 10){
            seconds = "0" + seconds
        }
        return `${minutes}:${seconds}`
}

export function Histogram({rawData}){
    const genres = useMemo(function(){
        return ["Blues", "Classical", "Country", "Disco", "Hiphop", "Jazz", "Metal", "Pop", "Reggae", "Rock"];
    }, [])
    
    const [data, setData] = useState(null);

    useEffect(function(){
        let newData = [];
        let newEntry = {};
        for(let i = 0; i < rawData.length; ++i){
            newEntry = {
                genre: rawData[i],
                time: i*1.5
            }
            newData.push(newEntry);
        }
        setData(newData)
    }, [rawData, genres])

    function yFormatter(value){
        return(`${genres[value]}`);
    }

    function xFormatter(value){
        return formatTime(value)
    }
    
    return(
        <div id="histogram">
        {data && (
          <div style={{display: "flex", justifyContent: "center"}}>

            <ResponsiveContainer width="99%" height={400}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <XAxis dataKey="time" tickFormatter={xFormatter}/>
              <YAxis tickCount={10} domain={[0, 9]} tickFormatter={yFormatter} />
              <Tooltip content={<CustomTooltip genres={genres}/>}/>
              <Line 
                isAnimationActive={false}
                // name="genre" 
                type="monotone" 
                dataKey="genre"
                stroke="#1c3041" 
                activeDot={{ r: 8, fill:"#faf" }}
                dot={{ fill: "#FAF", stroke: '#1C3041', strokeWidth: 2, r: 4,strokeDasharray:' '}}
            />
    
            </LineChart>
          </ResponsiveContainer>    
            
              </div>
        )}
        </div>
    )
}
