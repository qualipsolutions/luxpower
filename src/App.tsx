import { useState, useEffect } from "react";
import { Clock, RotateCcw, Asterisk } from "lucide-react";

//required by the BatteryCalculator component.

interface BatteryCalcProps {
  currentPercentage: number;
  dischargeRate: number;
  batteryCapacity: number;
  voltage: number;
  lowThreshold: number;
}

function calculateRemainingTime({
  currentPercentage,
  dischargeRate,
  batteryCapacity,
  voltage,
  lowThreshold,
}: BatteryCalcProps): string {
  if (currentPercentage <= lowThreshold || dischargeRate <= 0) {
    return "0h 0m";
  }

  const usableEnergyPercentage = (currentPercentage - lowThreshold) / 100;
  const totalWattHours = batteryCapacity * voltage;
  const usableWattHours = totalWattHours * usableEnergyPercentage;
  const hours = usableWattHours / dischargeRate;

  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60); // changing the remaining time and rounding it to hours

  return `${wholeHours}h ${minutes}m`; // hours : minutes
}

function App() {
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [dischargeRate, setDischargeRate] = useState(0);
  const [batteryCapacity, setBatteryCapacity] = useState(50);
  const [voltage, setVoltage] = useState(48);
  const [lowThreshold, setLowThreshold] = useState(10);
  const [remainingTime, setRemainingTime] = useState("");
  const [error, setError] = useState("");
  const [percentageError, setPercentageError] = useState<string>("");
  const [dischargeError, setDischargeError] = useState<string>("");
  const [capacityError, setCapacityError] = useState<string>("");
  const [voltageError, setVoltageError] = useState<string>("");
  const [lowThresholdError, setLowThresholdError] = useState<string>("");

  useEffect(() => {
    validateAndCalculate();
  }, [
    currentPercentage,
    dischargeRate,
    batteryCapacity,
    voltage,
    lowThreshold,
  ]);

  const validateAndCalculate = () => {
    setError("");

    if (currentPercentage <= lowThreshold) {
      setError("Battery low.");
    } else if (dischargeRate <= 0) {
      setError("Power usage must be greater than 0W");
    } else if (batteryCapacity <= 0) {
      setError("Battery capacity must be greater than 0Ah");
    } else if (voltage <= 0) {
      setError("Battery voltage must be greater than 0V");
    }

    const time = calculateRemainingTime({
      currentPercentage,
      dischargeRate,
      batteryCapacity,
      voltage,
      lowThreshold,
    });
    setRemainingTime(time);
  };

  // changes the results to the defaulted  values when reset button is pressed
  const resetValues = () => {
    setCurrentPercentage(0);
    setDischargeRate(0);
    setBatteryCapacity(50);
    setVoltage(48);
    setLowThreshold(10);
  };

  useEffect(() => {
    if (currentPercentage > 100) {
      setPercentageError("Percentage cannot exceed 100%");
    } else if (currentPercentage < 1 && currentPercentage !== 0) {
      setPercentageError("Percentage must be at least 1%");
    } else {
      setPercentageError("");
    }
  }, [currentPercentage]);

  useEffect(() => {
    if (dischargeRate > 10000) {
      setDischargeError("Power consumption cannot exceed 10,000W");
    } else if (dischargeRate < 1 && dischargeRate !== 0) {
      setDischargeError("Power consumption must be at least 1W");
    } else {
      setDischargeError("");
    }
  }, [dischargeRate]);

  useEffect(() => {
    if (batteryCapacity > 1000) {
      setCapacityError("Capacity cannot exceed 1000Ah");
    } else if (batteryCapacity < 1 && batteryCapacity !== 0) {
      setCapacityError("capacity must be at least 1Ah");
    } else {
      setCapacityError("");
    }
  }, [batteryCapacity]);

  useEffect(() => {
    if (voltage > 1000) {
      setVoltageError("Voltage cannot exceed 1000V");
    } else if (voltage < 1 && voltage !== 0) {
      setVoltageError("Voltage must be at least 1V");
    } else {
      setVoltageError("");
    }
  }, [voltage]);

  useEffect(() => {
    if (lowThreshold > 100) {
      setLowThresholdError("LowThreshold cannot exceed 100%");
    } else if (lowThreshold < 1 && lowThreshold !== 0) {
      setLowThresholdError("LowThreshold must be at least 1%");
    } else {
      setLowThresholdError("");
    }
  }, [lowThreshold]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-center">LuxPower</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6">Calculations</h2>
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2">
                  Battery Percentage
                  <Asterisk className="w-4 h-4 text-red-400" />
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentPercentage === 0 ? "" : currentPercentage}
                    placeholder="Input percentage (1-100%)"
                    onChange={(e) => {
                      const value = e.target.value;
                      //allow only numbers
                      if (/^\d{0,3}$/.test(value)) {
                        setCurrentPercentage(value === "" ? 0 : Number(value));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key.length === 1 &&
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full bg-gray-700 rounded px-3 py-2  placeholder-gray-500 focus:placeholder-gray-500"
                  />
                  <span className="w-8">%</span>
                </div>
                {percentageError && (
                  <p className="text-red-500 text-sm mt-1">{percentageError}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2">
                  Power Consumption
                  <Asterisk className="w-4 h-4 text-red-400" />
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dischargeRate === 0 ? "" : dischargeRate}
                    placeholder="Enter consumption (max 10,000 W)"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers
                      if (/^\d{0,5}$/.test(value)) {
                        setDischargeRate(Number(value));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (
                        e.key.length === 1 &&
                        !/[0-9]/.test(e.key) &&
                        e.key !== "Backspace" &&
                        e.key !== "Delete" &&
                        e.key !== "ArrowLeft" &&
                        e.key !== "ArrowRight"
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full bg-gray-700 rounded px-3 py-2  placeholder-gray-500 focus:placeholder-gray-500"
                  />
                  <span className="w-8">W</span>
                </div>
                {dischargeError && (
                  <p className="text-red-500 text-sm mt-1">{dischargeError}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2">
                  Battery Capacity
                  <Asterisk className="w-4 h-4 text-red-500" />
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={batteryCapacity === 0 ? "" : batteryCapacity}
                    placeholder="Enter capacity (1-1000 Ah)"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers
                      if (/^\d{0,4}$/.test(value)) {
                        setBatteryCapacity(Number(value));
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-gray-700 rounded px-3 py-2  placeholder-gray-500 focus:placeholder-gray-500"
                  />
                  <span className="w-8">Ah</span>
                </div>
                {capacityError && (
                  <p className="text-red-500 text-sm mt-1">{capacityError}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2">
                  Battery Voltage
                  <Asterisk className="w-4 h-4 text-red-500" />
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={voltage === 0 ? "" : voltage}
                    placeholder="Set voltage (1-1000 V)"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers
                      if (/^\d{0,4}$/.test(value)) {
                        setVoltage(Number(value));
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-gray-700 rounded px-3 py-2  placeholder-gray-500 focus:placeholder-gray-500"
                  />
                  <span className="w-8">V</span>
                </div>
                {voltageError && (
                  <p className="text-red-500 text-sm mt-1">{voltageError}</p>
                )}
                <br />
                <label className="flex items-center gap-2">
                  Low Threshold
                  <Asterisk className="w-4 h-4 text-red-500" />
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={lowThreshold === 0 ? "" : lowThreshold}
                    placeholder=" Enter Threshold percentage (1-100%)"
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow only numbers
                      if (/^\d{0,3}$/.test(value)) {
                        setLowThreshold(Number(value));
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className="w-full bg-gray-700 rounded px-3 py-2  placeholder-gray-500 focus:placeholder-gray-500"
                  />

                  <span className="w-8">%</span>
                </div>
                {lowThresholdError && (
                  <p className="text-red-500 text-sm mt-1">
                    {lowThresholdError}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm p-6 rounded-xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6">Estimated Time</h2>

            <div className="text-center p-6 bg-gray-900 bg-opacity-50 rounded-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Clock
                  className={`w-6 h-6 ${
                    error ? "text-red-500" : "text-green-400"
                  }`}
                />
                <span className="text-4xl font-bold">
                  {error ? "00:00" : remainingTime}
                </span>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={resetValues}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
