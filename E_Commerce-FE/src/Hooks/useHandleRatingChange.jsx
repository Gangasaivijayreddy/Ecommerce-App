import { useState} from "react";

// Rating change custom hook

export function useHandleRatingChange(){
    const [minRating, setMinRating] = useState(0);
const handleRatingChange = (e) => {
    setMinRating(Number(e.target.value));
  };
  function clearRating() {
    setMinRating(0);
  }
  return {minRating,clearRating,handleRatingChange}
}
