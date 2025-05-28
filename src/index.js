import "./style.css";

const newElement = (type, classes = []) => {
  const el = document.createElement(type);
  if (Array.isArray(classes) && classes.length > 0) {
    el.classList.add(...classes);
  }
  return el;
};

const submitBtn = document.querySelector("#submit-btn");
const container = document.querySelector("#display");

const apiKey = "M7SDA35LUKHT85PJ6AUGHEDDY";
const unit = "metric"; //metric or us

const getData = async (loc, unit) => {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${loc}?unitGroup=${unit}&key=${apiKey}&contentType=json`,
      { mode: "cors" }
    );

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("Bad Request: The location may be invalid or missing.");
      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.log("Error:", err);
    container.innerHTML = "";
    const errorMsg = newElement("div");
    errorMsg.textContent = `Can not fetch data for ${loc}`;
    container.append(errorMsg);
    return null;
  }
};

const processData = (data) => {
  if (!data || !data.currentConditions) return null;
  const {
    resolvedAddress,
    currentConditions: { temp, conditions, icon },
  } = data;
  const processedData = { resolvedAddress, temp, conditions, icon };
  return processedData;
};

const showData = (data) => {
  const city = newElement("div", ["city"]);
  city.textContent = data.resolvedAddress;
  const line = newElement("hr");
  const grid = newElement("div", ["display-grid"]);

  const tempName = newElement("div");
  tempName.textContent = "Temperature";
  const tempValue = newElement("div");
  tempValue.textContent = `${data.temp} °C`;

  const conditionName = newElement("div");
  conditionName.textContent = data.conditions;
  const conditionIcon = newElement("img");
  conditionIcon.src = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/4th%20Set%20-%20Color/${data.icon}.png`;
  conditionIcon.alt = "cond";

  grid.append(tempName, tempValue, conditionName, conditionIcon);
  container.append(line, city, grid);
};

const run = async (e) => {
  e.preventDefault();

  const locationInput = document.querySelector("#location");

  container.innerHTML = "";
  const loadingText = newElement("div");
  loadingText.textContent = "Loading..";
  container.append(loadingText);

  const data = await getData(locationInput.value, unit);
  locationInput.value = "";
  if (!data) {
    console.log("loading");
    // showLoading();
    return;
  }
  console.log(data);
  const pr = processData(data);
  container.innerHTML = "";
  showData(pr);
};

submitBtn.addEventListener("click", (e) => {
  run(e);
});
