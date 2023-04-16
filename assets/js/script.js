var city="";
var APIKey="b79b1e885cfb4e25c664d489a1c5c809"; //weather api key
var sCity=[];
// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}

// show current and future weather
function displayWeather(event){
    event.preventDefault();
    var currCity= $("#search-city").val().trim();
    if(currCity !==""){
        city=currCity;
        currentWeather(city);
    }else{
        alert('Please type a city name!');
    }
}

//add city to searched list
function addToList(c){
    var listEl= $("<li>"+c.toUpperCase()+"</li>");
    $(listEl).attr("class","list-group-item");
    $(listEl).attr("data-value",c.toUpperCase());
    $(".list-group").append(listEl);
}


function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}

function currentWeather(city){
    var queryURL= "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&APPID=" + APIKey;
    $.ajax({
        url:queryURL,
        method:"GET",
    }).then(function(response){
        var iconurl="https://openweathermap.org/img/wn/"+ response.weather[0].icon +"@2x.png";
        
        var date=new Date(response.dt*1000).toLocaleDateString();
        //Get City name with weather image
        $('#current-city').html(response.name +"("+date+")" + "<img src="+iconurl+">");

        //Get Temp
        $('#temperature').html((response.main.temp).toFixed(2)+"&#8451");

        //Get the Humidity
        $('#humidity').html(response.main.humidity+"%");
        //Display Wind speed and convert to MPH
        var windsmph=(response.wind.speed*2.237).toFixed(1);
        $('#wind-speed').html(windsmph+"MPH");

        forecast(response.id);
        if(response.cod==200){
            sCity=JSON.parse(localStorage.getItem("cityname"));
            if (sCity==null){
                sCity=[];
                sCity.push(city.toUpperCase()
                );
                localStorage.setItem("cityname",JSON.stringify(sCity));
                addToList(city);
            }
            else {
                if(find(city)>0){
                    sCity.push(city.toUpperCase());
                    localStorage.setItem("cityname",JSON.stringify(sCity));
                    addToList(city);
                }
            }
        }

    });
}

    
// function to get the 5 days future forecast
function forecast(cityid){
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&units=metric&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){

        $("#future-weather").empty();
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toLocaleDateString();
            var iconurl="https://openweathermap.org/img/wn/"+response.list[((i+1)*8)-1].weather[0].icon+".png";
            var temp= response.list[((i+1)*8)-1].main.temp;
            var humidity= response.list[((i+1)*8)-1].main.humidity;
        
            $("#future-weather").append(`
            <div class="col-sm-2 bg-secondary forecast text-white ml-2 mb-3 p-2 mt-2 rounded" >
                <p>${date}</p>
                <p><img src="${iconurl}"></p>
                <p>Temp:<span>${temp}&#8451</span></p>
                <p>Humidity:<span>${humidity}%</span></p>
            </div>`);

            
        }
        
    });
}

// get weather of past searches
function invokePastSearch(event){
    var liEl=event.target;
    if (event.target.matches("li")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }

}



$("#search-button").on("click",displayWeather);

//Execute when the page is loaded
$(document).on("click",invokePastSearch);
$(window).on("load",loadlastCity);