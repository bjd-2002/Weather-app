document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.querySelector(".search input");
  const searchBtn = document.querySelector(".search button");
  const cityNameDisplay = document.querySelector(".city");
  const tempDisplay = document.querySelector(".temp");
  const weatherImg = document.querySelector(".weather img");
  const cityList = document.querySelector(".city-list");

  const cities = JSON.parse(localStorage.getItem("city-list")) || [];

  const updateLocalStorage = () => {
    localStorage.setItem("city-list", JSON.stringify(cities));
  };

  const addCities = (cityName) => {
    if (cities.includes(cityName)) return;
    showCity(cityName);
    cities.push(cityName);
    updateLocalStorage();
  };

  const showCity = (cityName) => {
    const li = document.createElement("li");
    li.innerHTML = `${cityName}
      <button>Remove</button>`;
    li.classList.add("history");
    cityList.appendChild(li);
  };

  const renderCities = () => {
    console.log(cities);

    cities.forEach((cityName) => {
      showCity(cityName);
    });
  };

  const removeCity = (city) => {
    const index = cities.lastIndexOf(city);
    cities.splice(index, 1);
    updateLocalStorage();
  };

  searchBtn.addEventListener("click", async (e) => {
    try {
      showCityWeather(cityInput.value.trim());
    } catch (error) {
      cityInput.value = "";
      throw new Error("Invalid input");
    }
  });

  const showCityWeather = async (city) => {
    const response = await fetch(url);
    const data = await response.json();
    //   console.log(data);
    cityNameDisplay.textContent = data.name || "New York";
    const tempInC = Math.floor(parseFloat(data.main.temp) - 273.15);
    tempDisplay.textContent = `${tempInC}°C` || "22°C";
    const weatherCond = data.weather;
    console.log(weatherCond[0].main);

    const imgUrl = `images/${weatherCond[0].main}.png`;
    weatherImg.src = imgUrl;

    weatherImg.onerror = () => {
      weatherImg.src = "images/clear.png"; // Fallback image
      console.warn("Weather image not found, using default.");
    };

    addCities(data.name);

    cityInput.value = "";
  };

  cityList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const listItem = e.target.closest("li"); // Get the parent <li> element of the button
      if (listItem) {
        const city = listItem.textContent.trim().replace("Remove", "").trim();
        console.log(city);

        removeCity(city);
        listItem.remove(); // Remove the <li> element from the DOM
      }
    } else {
      const listItem = e.target.closest("li");
      const city = listItem.textContent.trim().replace("Remove", "").trim();
      showCityWeather(city);
    }
  });
  renderCities();
});
