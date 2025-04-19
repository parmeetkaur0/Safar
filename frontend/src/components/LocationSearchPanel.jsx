import React from 'react'
const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'pickup') {
        setPickup(suggestion);
    } else if (activeField === 'destination') {
        setDestination(suggestion);
    }
    setPanelOpen(false);
};

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-md p-5">
    {suggestions.length > 0 ? (
      suggestions.map((elem, idx) => (
        <div
          key={idx}
          onClick={() => handleSuggestionClick(elem)}
          className="flex gap-4 border-b border-gray-100 p-3 items-center cursor-pointer hover:bg-gray-50"
        >
          <div className="bg-gray-200 h-10 w-10 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill text-blue-500 text-lg"></i>
          </div>
          <h4 className="font-medium text-gray-800">{elem}</h4>
        </div>
      ))
    ) : (
      <div className="text-gray-500 text-center py-4">No suggestions available</div>
    )}
  </div>
  )
}

export default LocationSearchPanel