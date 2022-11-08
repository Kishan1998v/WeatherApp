// api part:
let City_val = "Jabalpur";
const API_KEY = "b868f6273905003b5a084068043293b9";
const getCurrentWeatherDAta = async() => {
    const city = City_val;
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);                       
    return response.json();
}

const gethourlyforecast = async({name:city})=>{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`);
    let data =await response.json()
    return data.list.map((forcast)=>{
        const { main:{temp,pressure,temp_min,temp_max},weather:[{description,icon}],dt,dt_txt } = forcast;
        return {temp,pressure,temp_max,temp_min,description,icon,dt,dt_txt};
    })
}

// Weather Current data
// formating the temp
const formatTemp = (temp)=>{return ` ${temp?.toFixed(1)}°c`} 
const loadCurrentForecast = ({ name , main:{ temp,temp_max,temp_min}, weather:[{description}]  })=>{
        // we use destructuring here
        const  currentForecastElement = document.querySelector("#Current-Forecast");
        currentForecastElement.querySelector(".city").textContent = name;
        currentForecastElement.querySelector(".temp").textContent = formatTemp(temp);
        currentForecastElement.querySelector(".Description").textContent = description;
        currentForecastElement.querySelector(".min-max-temp").textContent = `H: ${formatTemp(temp_max)}___L:${formatTemp(temp_min)}`;
}

// Hourly weather data
const loadhourlyForecast = (hourlyForecast)=>{
    console.log(hourlyForecast.slice(1,13));
    const datafor12hours = hourlyForecast.slice(1,13);

    const HourlyContainer = document.querySelector(".Hourly-container");
    // we will generate all this From here
    //     <article>
    //         <h2 class="time">Now</h2>
    //         <img class="icon"/>icon
    //         <p class="hourly-temp">temp</p>
    //     </article>
    //so we use innerHTML to getit done
    let innerHTMLstring = ``
    //formatting icon
    let formatingIcon = (icon)=>{
        return `http://openweathermap.org/img/wn/${icon}@2x.png`
    }
    const formatTemp = (temp)=>{return ` ${temp?.toFixed(1)}°f`} 
    
    //Creating the Data 
    for(let {temp,icon,dt_txt,description} of datafor12hours){
        innerHTMLstring  += `
            <article>
                 <h2 class="time">${dt_txt.split(" ")[1]}</h2>
                 <img class="icon" src="${formatingIcon(icon)}"/>
                 <p class="hourly-temp">${formatTemp(temp)}</p>
                 <p>${description}</p>
            </article>
        `
    }
    HourlyContainer.innerHTML = innerHTMLstring ;
    
    
}
document.addEventListener("DOMContentLoaded",async()=>{
    // currentWeather
    const currentWeather = await getCurrentWeatherDAta();
    loadCurrentForecast(currentWeather);
    //HourlyWeather
    const hourlyForecast = await gethourlyforecast(currentWeather);
    loadhourlyForecast(hourlyForecast);
})