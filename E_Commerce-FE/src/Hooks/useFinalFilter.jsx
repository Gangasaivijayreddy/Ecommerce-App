
export function useFinalFilter(productsList, minRating, sortByPrice, categoryToFilter, searchTerm) {
  let results = [...productsList];

  if (minRating) {
    results = results.filter(item => item.rating >= minRating);
  }

  if (categoryToFilter) {
    results = results.filter(item => item.category === categoryToFilter);
  }

  if (searchTerm.trim()) {
    const normalizedSearch = searchTerm.toLowerCase();
    results = results.filter(item =>
      item.productName?.toLowerCase().includes(normalizedSearch) ||
      item.fullDetails?.toLowerCase().includes(normalizedSearch)
     
    );
  }

  if (sortByPrice === "low") {
    results.sort((a, b) => a.price - b.price);
  } else if (sortByPrice === "high") {
    results.sort((a, b) => b.price - a.price);
  }

  return results;
}
