
// import { useParams } from "react-router-dom";

export function Test(){

  // const {id} = useParams();

  function handleParentClick(e){
    console.log("parent click");
    e.stopPropagation();

  }

  function handleChildClick(e){
    e.stopPropagation();
    console.log("child click")
  }

  return(
    <div>
      <div onClick={handleParentClick}>Parent
      <div onClick={handleChildClick}>Children</div></div>
    </div>
  )
}