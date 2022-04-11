import React from "react";
import RideCard from "./RideCard";

function CardsComponent(props) {
  return (
    <div>
      {props.filter === "nearest" ? (
        <>
          {props.array &&
            props.array.map((item) => (
              <RideCard
                id={item.id}
                origin={item.origin_station_code}
                path={JSON.stringify(item.station_path)}
                date={item.date}
                distance={item.distance}
                city={item.city}
                state={item.state}
                imgUrl={item.map_url}
              />
            ))}
        </>
      ) : props.filter === "upcoming" ? (
        <>
          {props.uarr &&
            props.uarr.map((item) => (
              <RideCard
                key={item.id}
                id={item.id}
                origin={item.origin_station_code}
                path={JSON.stringify(item.station_path)}
                date={item.date}
                distance={item.distance}
                city={item.city}
                state={item.state}
                imgUrl={item.map_url}
              />
            ))}
        </>
      ) : props.filter === "past" ? (
        <>
          {props.parr &&
            props.parr.map((item) => (
              <RideCard
                id={item.id}
                origin={item.origin_station_code}
                path={JSON.stringify(item.station_path)}
                date={item.date}
                distance={item.distance}
                city={item.city}
                state={item.state}
                imgUrl={item.map_url}
              />
            ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
export default CardsComponent;
