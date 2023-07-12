import React, { useEffect, useState } from "react";

import pingSound from "../sounds/ping.mp3";

const Countdown = () => {
  const [workTimeMin, setWorkTimeMin] = useState(0);
  const [workTimeMax, setWorkTimeMax] = useState(0);
  const [breakTime, setBreakTime] = useState(0);
  const [sets, setSets] = useState(1);
  const [countdown, setCountdown] = useState(0);
  const [currentSet, setCurrentSet] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const pingAudio = new Audio(pingSound);

  const startCountdown = () => {
    setIsRunning(true);
  };

  const handleSetsChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setSets(value);
    }
  };

  const resetValues = () => {
    setWorkTimeMin(0);
    setWorkTimeMax(0);
    setBreakTime(0);
    setSets(1);
    setCountdown(0);
    setCurrentSet(0);
    setIsRunning(false);
  };

  // In the useEffect hook, update the logic to set the countdown based on the currentSet value
  useEffect(() => {
    if (isRunning) {
      if (countdown === 0) {
        if (currentSet % 2 === 0) {
          // Break time completed, start work time
          const randomWorkTime = Math.floor(
            Math.random() * (workTimeMax - workTimeMin + 1) + workTimeMin
          );
          setCountdown(randomWorkTime);
        } else {
          // Work time completed, start break time
          setCountdown(breakTime);
        }

        setCurrentSet((prevSet) => prevSet + 1);
        pingAudio.play(); // Play the ping sound
      } else {
        const timer = setTimeout(
          () => setCountdown((prevCount) => prevCount - 1),
          1000
        );
        return () => clearTimeout(timer);
      }
    }

    // Stop timer after completing the specified number of sets
    if (currentSet === sets * 2) {
      setIsRunning(false);
      resetValues();
    }
  }, [
    countdown,
    currentSet,
    breakTime,
    isRunning,
    sets,
    workTimeMin,
    workTimeMax,
  ]);

  useEffect(() => {
    if (isRunning && currentSet % 2 === 0) {
      setCountdown(breakTime);
    } else if (isRunning && currentSet % 2 !== 0) {
      const randomWorkTime = Math.floor(
        Math.random() * (workTimeMax - workTimeMin + 1) + workTimeMin
      );
      setCountdown(randomWorkTime);
    }
  }, [isRunning, workTimeMin, workTimeMax, breakTime, currentSet]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-16">Workout Countdown</h1>
      <div className="mx-2 my-2">
        <label htmlFor="workTimeMin">Work Time Min (seconds):</label>
        <input
          type="number"
          id="workTimeMin"
          value={workTimeMin}
          onChange={(e) => setWorkTimeMin(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="mx-2 my-2">
        <label htmlFor="workTimeMax">Work Time Max (seconds):</label>
        <input
          type="number"
          id="workTimeMax"
          value={workTimeMax}
          onChange={(e) => setWorkTimeMax(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="mx-2 my-2">
        <label htmlFor="breakTime">Break Time (seconds):</label>
        <input
          type="number"
          id="breakTime"
          value={breakTime}
          onChange={(e) => setBreakTime(parseInt(e.target.value))}
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="mx-2 mt-2 my-4">
        <label htmlFor="sets">Number of Sets:</label>
        <input
          type="number"
          id="sets"
          value={sets}
          onChange={handleSetsChange}
          className="border rounded px-2 py-1"
          min="1"
        />
      </div>
      <button
        onClick={startCountdown}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start
      </button>
      <div className="mx-2 my-4">
        {isRunning ? (
          <p className="text-2xl font-bold">
            Set {Math.ceil(currentSet / 2)}: {countdown} seconds
            {currentSet % 2 === 0 ? " (Break Time)" : " (Work Time)"}
          </p>
        ) : (
          <p className="text-2xl">Click 'Start' to begin countdown</p>
        )}
      </div>
    </div>
  );
};

export default Countdown;
