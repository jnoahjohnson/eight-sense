import { Step } from "@prisma/client";
import useTimer from "~/hooks/useTimer";
import { getTime } from "~/utils/timerUtils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/outline";

export default function Timer({ steps }: { steps: Step[] }) {
  const {
    currentStep,
    pause,
    play,
    nextStep,
    previousStep,
    timerState,
    outputTime,
  } = useTimer(steps);

  return (
    <div className="w-full border-8 border-solid border-gray-400 rounded-full flex flex-col items-center justify-around aspect-square">
      <p className="text-5xl md:text-6xl font-light text-gray-700">
        {currentStep.name}
      </p>
      <p className="text-8xl md:text-9xl font-bold text-gray-800">
        {outputTime}
      </p>
      <div className="flex space-x-2 text-gray-400">
        <button onClick={previousStep}>
          <ChevronLeftIcon className="w-20 h-20" />
        </button>
        {timerState.isPlaying ? (
          <button onClick={pause}>
            <PauseIcon className="w-20 h-20 md:w-24 md:h-24 " />
          </button>
        ) : (
          <button onClick={play}>
            <PlayIcon className="w-20 h-20 md:w-24 md:h-24 " />
          </button>
        )}
        <button onClick={nextStep}>
          <ChevronRightIcon className="w-20 h-20" />
        </button>
      </div>
    </div>
  );
}
