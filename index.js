const onBtnClick = async () => {
  event.preventDefault()
  const name = document.getElementById("name").value
  const email = document.getElementById("email").value
  const zipcode = document.getElementById("zipcode").value
  const latitude = document.getElementById("latitude").value
  const longitude = document.getElementById("longitude").value
  validate(name, email, zipcode, latitude, longitude)


  try {
    const zipcodeData = await getZipcodeData(zipcode)
    updateCityData(zipcodeData)

    const weatherData = await getWeatherData(latitude, longitude)
    const currentTemperature = weatherData.hourly.temperature_2m[0]
    updateWeather(currentTemperature)

  } catch (error) {
    throw new Error(error)
  }

}

const validate = (name, email, zipcode, latitude, longitude) => {

  const nameNotFound = document.getElementById("name-not-found")
  if (name.length < 1) {
    nameNotFound.classList.remove("visually-hidden")
  } else nameNotFound.classList.add("visually-hidden")


  const emailNotFound = document.getElementById("email-not-found")
  if (!email.includes("@")) {
    emailNotFound.classList.remove("visually-hidden")
  } else emailNotFound.classList.add("visually-hidden")

  const cepNotFound = document.getElementById("cep-not-found")
  if (zipcode.length !== 8) {
    cepNotFound.classList.remove("visually-hidden")
  } else cepNotFound.classList.add("visually-hidden")

  if (isNaN(latitude) || latitude < -90 || latitude > 90) {
    console.log("Invalid latitude:", latitude);
  }

  if (isNaN(longitude) || longitude < -180 || longitude > 180) {
    console.log("Invalid longitude:", longitude);
  }
};

const updateCityData = (data) => {
  const city = document.getElementById("city")
  const neighborhood = document.getElementById("neighborhood")
  const state = document.getElementById("state")

  city.textContent = data.localidade
  neighborhood.textContent = data.bairro
  state.textContent = data.uf
}

const updateWeather = (temperature) => {
  const weatherElement = document.getElementById("weather")
  weatherElement.textContent = `Previsão de tempo de acordo com a região: ${temperature}° C`
}

const getZipcodeData = async (zipcode) => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${zipcode}/json/`)
    if (response.status === 200) {
      const zipcodeData = await response.json()
      return zipcodeData
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getWeatherData = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`)
    if (response.status === 200) {
      const data = await response.json()
      return data
    }
  } catch (error) {
    throw new Error(error)
  }
}