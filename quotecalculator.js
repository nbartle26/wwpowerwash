document.getElementById('quoteForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const servicePrices = {
    gutterCleaning: 0.05,
    residentialPressure: 0.10,
    commercialPressure: 0.08,
    fenceDeckCleaning: 0.06,
    windowWashing: 0.10
  };

  const service = document.getElementById('service').value;
  const areaSizeInput = document.getElementById('areaSize').value.trim();
  const areaSize = Number(areaSizeInput);

  if (!service) {
    alert('Please select a service.');
    return;
  }

  if (!areaSizeInput || isNaN(areaSize) || !Number.isInteger(areaSize) || areaSize <= 0) {
    alert('Please enter a valid positive integer for area size.');
    return;
  }

  const pricePerSqFt = servicePrices[service];
  const total = (pricePerSqFt * areaSize).toFixed(2);

  alert(`Your total quote is $${total}`);
});
