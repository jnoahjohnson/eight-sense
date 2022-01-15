import { Step } from "@prisma/client";
import { useEffect, useState } from "react";
import { useNavigate } from "remix";
import { getTime } from "~/utils/timerUtils";

export type TimerState = {
  isPlaying: boolean;
  time: number;
  currentTime: number;
};

const initialTimerState: TimerState = {
  isPlaying: false,
  time: 120,
  currentTime: 0,
};

export default function useTimer(steps: Step[]) {
  const [currentStep, setCurrentStep] = useState<Step>(steps[0]);
  const [timerState, setTimerState] = useState<TimerState>({
    isPlaying: false,
    time: currentStep.time,
    currentTime: 0,
  });
  const [outputTime, setOutputTime] = useState<string>("");
  const navigate = useNavigate();

  // Set new output time
  useEffect(() => {
    setOutputTime(getTime(timerState.time - timerState.currentTime));
    if (timerState.time === timerState.currentTime) {
      nextStep();
    }
  }, [timerState.currentTime]);

  useEffect(() => {
    let playingInterval: NodeJS.Timer | null = null;

    if (timerState.isPlaying) {
      playingInterval = setInterval(() => {
        setTimerState((prev) => ({
          ...prev,
          currentTime: prev.currentTime + 1,
        }));
      }, 1000);
    } else {
      if (playingInterval) clearInterval(playingInterval);
    }

    return () => {
      if (playingInterval) clearInterval(playingInterval);
    };
  }, [timerState.isPlaying]);

  const pause = () => {
    setTimerState((prev) => ({ ...prev, isPlaying: false }));
  };
  const play = () => {
    setTimerState((prev) => ({ ...prev, isPlaying: true }));
  };
  const nextStep = () => {
    if (currentStep === steps[steps.length - 1]) {
      // How should we deal with the final step in the hook?
      pause();
      navigate("/");
      return;
    }

    // Play audio
    const sound = new Audio("/audio/beep.mp3");
    sound.play();

    // So this should work because the order starts with 1, but there could be a better way
    setTimerState((prev) => ({
      ...prev,
      time: steps[currentStep.order].time,
      currentTime: 0,
    }));

    setCurrentStep((prev) => steps[prev.order]);
  };
  const previousStep = () => {
    if (currentStep === steps[0]) {
      // How should we deal with the first step in the hook?
      return;
    }

    // So this should work because the order starts with 1, but there could be a better way
    setCurrentStep((prev) => steps[prev.order - 2]);
  };

  return {
    currentStep,
    pause,
    play,
    nextStep,
    previousStep,
    timerState,
    outputTime,
  };
}
