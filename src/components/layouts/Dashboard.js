import { Fragment, useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import Card from "../UI/Card";
import { Line } from "react-chartjs-2";
import GaugeChart from "react-gauge-chart";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceData, disconnectsocket } from "../../store/actions/device";
import Switch from "@material-ui/core/Switch";
import moment from "moment";
import { getSwitchData, toggleSwitch } from "../../store/actions/switch";
import Header from "./Header";
const GET_DEVICE_PARAMS_EVENT = "GET_DEVICE_PARAMATERS";
const data = {
  labels: [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ],
  datasets: [
    {
      label: "Current in Amperes",
      data: [12, 19, 3, 5, 2, 3, 5, 5, 7, 4, 5, 5, 6],
      fill: false,
      backgroundColor: "#5accf0",
      borderColor: "#5accf0",
    },
  ],
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};
const maxCurrnet = 20;
const maxVoltage = 240;
const maxPower = 5000;

const Dashboard = () => {
  const [isRelayOn, setIsRelayOn] = useState(false);
  const dispatch = useDispatch();
  const deviceData = useSelector((state) => state.devices);
  const selectedDevice = deviceData.devices.find(
    (device) => device.device_imei === deviceData.selectedDevice_id
  );
  const current = deviceData.current / maxCurrnet;
  const voltage = deviceData.voltage / maxVoltage;
  const power = deviceData.power / maxPower;
  const date = moment(deviceData.createdAt).format("LLL");
  const cardTime = moment(deviceData.createdAt).format("LT");
  const relay_status = useSelector((state) => state.switch.relay_on);

  let deviceStatusClasses;
  if (selectedDevice !== null && selectedDevice !== undefined) {
    deviceStatusClasses =
      selectedDevice.status === "active"
        ? styles["device__activity__status--active"]
        : styles["device__activity__status--deactive"];
  }

  const onChangeRelayHandler = (event) => {
    dispatch(toggleSwitch(event.target.checked));
  };
  useEffect(() => {
    dispatch(getDeviceData());
    dispatch(getSwitchData());

    return () => {
      disconnectsocket();
    };
  }, []);
  if (
    selectedDevice === null ||
    !selectedDevice ||
    selectedDevice === undefined
  ) {
    return (
      // <div className={styles["cardContainer"]}>
      <div className={styles["fallback"]}>
        <span>No devices found please go do devices page and add device!</span>
      </div>
      // </div>
    );
  }
  return (
    <Fragment>
      <Header
        title={`Device: ${
          selectedDevice ? `${selectedDevice.device_name}` : ""
        }`}
        device_imei={selectedDevice ? `${selectedDevice.device_imei}` : ""}
      />
      <div className={styles["cardContainer"]}>
        <Card styles={styles["card"]}>
          <h4 className={styles["card__title"]}>Current</h4>

          <GaugeChart
            id="gauge-chart-current"
            nrOfLevels={20}
            percent={current}
            // needleColor="#5accf0"
            textColor="#5accf0"
            formatTextValue={(value) => deviceData.current + "A"}
          />
          <span className={styles["card__date"]}>{cardTime}</span>
        </Card>
        <Card styles={styles["card"]}>
          <h4 className={styles["card__title"]}>Voltage</h4>

          <GaugeChart
            id="gauge-chart-voltage"
            textColor="#5accf0"
            nrOfLevels={20}
            percent={voltage}
            // colors={["#FF5F6D", "#FFC371"]}
            arcWidth={0.3}
            formatTextValue={(value) => deviceData.voltage + "V"}
          />
          <span className={styles["card__date"]}>{cardTime}</span>
        </Card>
        <Card styles={styles["card"]}>
          <h4 className={styles["card__title"]}> Power</h4>
          <GaugeChart
            id="gauge-chart-power"
            textColor="#5accf0"
            // nrOfLevels={20}
            percent={power}
            formatTextValue={(value) => deviceData.power + "W"}
          />
          <span className={styles["card__date"]}>{cardTime}</span>
        </Card>
      </div>
      <div className={styles["device__activity"]}>
        <div>
          <span className={styles["device__activity__label"]}>
            Last log date:{" "}
            <span className={styles["device__activity__date"]}>{date}</span>
          </span>
        </div>
        <div>
          <span className={styles["device__activity__label"]}>
            status:{" "}
            <div className={deviceStatusClasses}>
              <span> {selectedDevice ? selectedDevice.status : ""}</span>
            </div>
          </span>
        </div>
        <div>
          <span className={styles["device__activity__label"]}>
            Location: Kasubi-43
          </span>
        </div>
        <div className={styles["device__activity__switch"]}>
          <div>
            <span className={styles["device__activity__relay"]}>relay</span>
          </div>
          <Switch
            checked={relay_status}
            onChange={onChangeRelayHandler}
            name="checkedA"
            color="primary"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      </div>
      <div className={styles["charts-div"]}>
        {/* <span className={styles["chartsContainer__heading"]}>Statistics</span> */}
        <Card styles={styles["chartsContainer"]}>
          <h4 className={styles["card__title"]}>Anual Power</h4>
          <Line data={data} options={options} />
        </Card>
        {/* <Card styles={styles["chartsContainer"]}>
          <h4 className={styles["card__title"]}>Power</h4>
          <Line data={data} options={options} />
        </Card>
        <Card styles={styles["chartsContainer"]}>
          <h4 className={styles["card__title"]}>Power</h4>
        </Card> */}
      </div>
    </Fragment>
  );
};

export default Dashboard;