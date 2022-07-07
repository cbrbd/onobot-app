export function OnoStats(props){
    if(props.data){
        return(
            <div id="predictions-stats">
                <div>
                    Not tagged: {props.data.untagged}
                </div>
                <div>
                    Precision: {Math.floor(100*props.data.goodPred/props.data.total)}%
                </div>
                <div>
                    Total predictions: {props.data.total}
                </div>
            </div>
        )
    } else {
        return(
            <div>Could not load stats</div>
        )
    }
    
}