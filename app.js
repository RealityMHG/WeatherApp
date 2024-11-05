window.addEventListener("DOMContentLoaded", (event) => {

    const container = document.querySelector(".container");
    const search = document.querySelector(".search-box button");
    const searchInput = document.querySelector("input");
    const weatherBox = document.querySelector(".weather-box");
    const weatherDetails = document.querySelector(".weather-details");
    const weatherForecast = document.querySelector(".weather-forecast");
    const error404 = document.querySelector(".not-found");

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    search.addEventListener("click", ()=>{
        searchWeather();
    });

    searchInput.addEventListener("keyup", (event)=>{
        if(event.key == 'Enter'){
            searchWeather();
        }
    });

    function searchWeather() {
        const APIKey = "433c08dd972556fdbae09385a6db644e";
        const city = document.querySelector(".search-box input").value;
        
        if(city == "")
             return;
            
        fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
        .then(response => response.json())
        .then(json => {
            
            if(json.cod == "404"){
                container.style.height = "450px";
                weatherBox.style.display = "none";
                weatherDetails.style.display = "none";
                weatherForecast.style.display = "none";
                error404.style.display = "block";
                error404.classList.add("fadeIn");
                return;
            }
            
            error404.style.display = "none";
            error404.classList.remove("fadeIn");

            weatherBox.style.display = "block";
            weatherDetails.style.display = "flex";
            weatherForecast.style.display = "flex";
            
            const humidity = document.querySelector(".weather-details .humidity span");
            const wind = document.querySelector(".weather-details .wind span");

            const forecastImages = document.querySelectorAll(".weather-box img");
            const forecastDates = document.querySelectorAll(".weather-box .date");
            const forecastTemperatures = document.querySelectorAll(".weather-box .temperature");
            const forecastDescriptions = document.querySelectorAll(".weather-box .description");
            
            let jsonId = 0;
            for(let i=0; i<5; i++){
                switch(json.list[jsonId].weather[0].main){
                    case "Clear":
                        forecastImages[i].src = "images/clear.png";
                        break;
                    
                    case "Rain":
                        forecastImages[i].src = "images/rain.png";
                        break;
                    
                    case "Snow":
                        forecastImages[i].src = "images/snow.png";
                        break;
                            
                    case "Clouds":
                        forecastImages[i].src = "images/cloud.png";
                        break;
    
                    case "Haze":
                        forecastImages[i].src = "images/mist.png";
                        break;
    
                    default:
                        forecastImages[i].src = "";
                }
                
                forecastTemperatures[i].innerHTML = `${parseInt(json.list[jsonId].main.temp)}<span>°C</span>`;
                forecastDescriptions[i].innerHTML = `${json.list[jsonId].weather[0].description}`;

                if(i==1){
                    forecastDates[i-1].innerHTML = "Tomorrow";
                }else if(i>1){
                    console.log(forecastDates);
                    let dayOfWeek = new Date(`${json.list[jsonId].dt_txt.slice(0,10)}`);
                    console.log(dayOfWeek);
                    forecastDates[i-1].innerHTML = dayNames[dayOfWeek.getDay()];
                }
                
                jsonId = indexOfNextDay(jsonId,json.list[jsonId].dt_txt) + 5;
            }

            humidity.innerHTML = `${json.list[0].main.humidity}%`;
            wind.innerHTML = `${parseInt(json.list[0].wind.speed)}Km/h`;

            searchInput.value = `${json.city.name}` + `, ${json.city.country}`;

            container.style.height = "620px";
        });
    }

    //Json date format: "2024-10-02 00:00:00"
    function indexOfNextDay(index,dateString){
        let hourOfDay = Number(dateString.slice(11,13));
        return index + ((24-hourOfDay)/3);
    }
});
