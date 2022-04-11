import Navbar from "./Components/Navbar";
import "./assets/styles/main.css";
import FilterSection from "./Components/FilterSection";
import CardsComponent from "./Components/CardsComponent";
import axios from "axios";
import { useState, useEffect } from "react";
function App() {
  //setting state
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState("nearest");
  const [user, setUser] = useState({});

  const [narrAll, setNArrAll] = useState();
  const [uarrAll, setUArrAll] = useState();
  const [parrAll, setPArrAll] = useState();
  const [narrCur, setNArrCur] = useState();
  const [uarrCur, setUArrCur] = useState();
  const [parrCur, setPArrCur] = useState();

  const [stateArr, setStateArr] = useState();
  const [cityArr, setCityArr] = useState();
  const [fState, setFState] = useState("");
  const [fCity, setFCity] = useState("");
  const [map, setMap] = useState();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    //User Data
    await axios
      .get("https://assessment.api.vweb.app/user")
      .then(async (response) => {
        setUser(response.data);

        //Rides Data
        await axios
          .get("https://assessment.api.vweb.app/rides")
          .then((resp) => {
            const tmp = resp.data;
            const arr = resp.data;
            var d;
            var user_d = response.data.station_code;

            //Distance value for all objects
            for (var i = 0; i < arr.length; i++) {
              d = 10000000;
              for (var j = 0; j < arr[i].station_path.length; j++) {
                if (Math.abs(arr[i].station_path[j] - user_d) < d) {
                  d = Math.abs(arr[i].station_path[j] - user_d);
                }
              }
              tmp[i].distance = d;
            }

            //Bubble sort of distance
            for (var i = 0; i < tmp.length; i++) {
              for (var j = 0; j < tmp.length; j++) {
                if (tmp[i].distance < tmp[j].distance) {
                  var temp2 = tmp[i];
                  tmp[i] = tmp[j];
                  tmp[j] = temp2;
                }
              }
            }

            setNArrAll(tmp);
            setNArrCur(tmp);

            //Filtering rides
            const upcoming = tmp.filter((item) => {
              return new Date(item.date) - new Date() > 0;
            });
            const past = tmp.filter((item) => {
              return new Date(item.date) - new Date() < 0;
            });

            setUArrAll(upcoming);
            setUArrCur(upcoming);
            setPArrAll(past);
            setPArrCur(past);

            //Arrays of all states and cities
            const states = tmp.map((item) => {
              return item.state;
            });
            const cities = tmp.map((item) => {
              return item.city;
            });
            const statesUnique = [...new Set(states)];
            const citiesUnique = [...new Set(cities)];

            //Object creation to map state to city
            const stateMap = {};
            statesUnique.map((item) => {
              stateMap[item] = [];
            });
            for (var i = 0; i < arr.length; i++) {
              stateMap[arr[i].state].push(arr[i].city);
            }
            for (var i = 0; i < Object.keys(stateMap).length; i++) {
              stateMap[Object.keys(stateMap)[i]] = [
                ...new Set(stateMap[Object.keys(stateMap)[i]]),
              ];
            }
            stateMap["all"] = citiesUnique;
            setMap(stateMap);
            setStateArr(statesUnique);
            setCityArr(citiesUnique);
          });
      });
  }, []);
  useEffect(() => {
    //Handling change in state filter
    var select = document.getElementById("citySelect");
    if (select !== null && select !== undefined) {
      select.value = "all";
    }

    if (fState !== "") {
      setCityArr(map[fState]);

      setNArrCur(narrAll.filter((item) => item.state === fState));
      setUArrCur(uarrAll.filter((item) => item.state === fState));
      setPArrCur(parrAll.filter((item) => item.state === fState));
    }
    if (fState === "all") {
      setCityArr(map[fState]);
      setNArrCur(narrAll);
      setUArrCur(uarrAll);
      setPArrCur(parrAll);
    }
  }, [fState, setFState]);

  useEffect(() => {
    //Handling change in city filter
    if (fCity !== "") {
      setNArrCur(narrAll.filter((item) => item.city === fCity));
      setUArrCur(uarrAll.filter((item) => item.city === fCity));
      setPArrCur(parrAll.filter((item) => item.city === fCity));
    }

    if (fCity === "all") {
      if (fState !== "") {
        setNArrCur(narrAll.filter((item) => item.state === fState));
        setUArrCur(uarrAll.filter((item) => item.state === fState));
        setPArrCur(parrAll.filter((item) => item.state === fState));
      }
    }
  }, [fCity, setFCity]);
  return (
    <div className="App">
      <Navbar user={user} />
      <FilterSection
        filter={filter}
        setFilter={setFilter}
        show={show}
        setShow={setShow}
        uarr={uarrCur}
        parr={parrCur}
        states={stateArr}
        cities={cityArr}
        setFState={setFState}
        setFCity={setFCity}
      />
      <CardsComponent
        array={narrCur}
        uarr={uarrCur}
        parr={parrCur}
        filter={filter}
      />
    </div>
  );
}

export default App;
