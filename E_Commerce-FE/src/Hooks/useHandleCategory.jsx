import { useState } from "react";

// handle category

export function useHandleCategory(category){
    const[categoryToFilter,setCategoryToFilter]=useState(null)

function handleCategory(e){
if (e.target.checked) {
  setCategoryToFilter(e.target.value)
  
}
else{
  setCategoryToFilter("")
}
}
 function clearCategory() {
    setCategoryToFilter("")
  }
return{categoryToFilter: categoryToFilter ?? (category || ""),handleCategory,clearCategory}
}
