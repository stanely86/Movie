import React, { useState } from "react";

export default function TestSearchHint(){
    const [userInput, SetUserInput]= useState([])

    function handleSearchType(value){
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())  
      .then((json) =>{
        const results = json.filter((user)=>{
        return(
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value.toLowerCase())
        )
        })
        SetUserInput(results)
      })  

    }
    return(
        <>
        <div>
            <input placeholder="Type to search..." onChange={(e)=>handleSearchType(e.target.value)} />
        </div>
        <div className="searchResult">
            {userInput.map((result, index)=>(
                <p key={index}>{result.name}</p>
            ))}
        </div>
        </>
    )
}