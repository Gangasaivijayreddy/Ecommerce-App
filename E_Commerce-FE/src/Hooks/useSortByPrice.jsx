import { useState} from "react";
// sort by price

export function useSortByPrice(){
    const [sortByPrice, setSortByPrice] = useState(""); 
     const handlePriceChange = (e) => {
  setSortByPrice(e.target.value);
};
function clearPriceSort() {
    setSortByPrice("");
  }
return {sortByPrice,clearPriceSort,handlePriceChange}
}