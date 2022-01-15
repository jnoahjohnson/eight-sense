import {
  ChevronDoubleUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CogIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { Step } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
  useTransition,
} from "remix";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export let action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const steps = formData.get("steps");

  if (typeof steps !== "string") {
    throw Error("there was an error saving");
  }

  let newSteps: Step[] = JSON.parse(steps);

  for (let i = 0; i < newSteps.length; i++) {
    let step = newSteps[i];

    if (!step.id) {
      console.log("here");
      await db.step.create({ data: step });
    } else {
      await db.user.update({
        where: {
          id: step.userId,
        },
        data: {
          steps: {
            update: {
              where: {
                id: step.id,
              },
              data: {
                name: step.name,
                order: step.order,
                time: step.time,
              },
            },
          },
        },
      });
    }
  }

  return redirect("/");
};

type LoaderData = {
  steps: Step[];
};

const defaultSteps: Step[] = [
  {
    id: "1",
    name: "Sight",
    order: 1,
    time: 10,
    userId: "1",
  },
  {
    id: "2",
    name: "Sound",
    order: 2,
    time: 10,
    userId: "1",
  },
];

export let loader: LoaderFunction = async ({ request }) => {
  let userId = await requireUserId(request);

  let steps = await db.step.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        order: "asc",
      },
    ],
  });

  if (steps.length === 0) {
    steps = defaultSteps.map((step) => ({ ...step, userId }));
  }

  const data: LoaderData = {
    steps,
  };

  return data;
};

type StepState = {
  id?: string;
  name: string;
  time: number;
  order: number;
  userId: string;
};

export default function Index() {
  const { steps } = useLoaderData<LoaderData>();
  const [newSteps, setNewSteps] = useState<StepState[]>(steps);
  const [newStep, setNewStep] = useState<StepState>({
    name: "",
    time: 120,
    order: newSteps.length + 1,
    userId: newSteps[0].userId,
  });

  const transition = useTransition();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Form method="post">
        <div className="flex items-end justify-between mb-4">
          <h1 className="text-5xl font-bold select-none">Meditate</h1>
          <input type="hidden" value={JSON.stringify(newSteps)} name="steps" />
          <button
            type="submit"
            disabled={transition.state === "submitting"}
            className="py-1 px-2 text-primay-dark text-xl bg-primary rounded text-green-100 disabled:bg-primary-light"
          >
            Done
          </button>
        </div>
      </Form>
      <form className="space-y-3 mb-2">
        {newSteps
          .sort((step, nextStep) => (step.order < nextStep.order ? 0 : 1))
          .map((step) => (
            <div
              key={step.id}
              className="w-full px-4 py-2 flex items-center justify-between bg-gray-50 shadow rounded select-none"
            >
              <div className="flex">
                <div className="flex items-center mr-2">
                  {step.order === 1 ? (
                    <div className="w-6 h-6" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        let changedSteps = [...newSteps];
                        console.log(changedSteps);
                        changedSteps = changedSteps.sort((step, nextStep) =>
                          step.order < nextStep.order ? 0 : 1
                        );

                        let stepIndex = changedSteps.findIndex(
                          (stepObject) => stepObject.id === step.id
                        );

                        if (stepIndex > 0) {
                          changedSteps[stepIndex].order -= 1;
                          changedSteps[stepIndex - 1].order += 1;
                        }

                        console.log(changedSteps);
                        setNewSteps(changedSteps);
                      }}
                    >
                      <ChevronUpIcon className="w-6 h-6" />
                    </button>
                  )}

                  {step.order === newSteps.length ? (
                    <div className="w-6 h-6" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        let changedSteps = [...newSteps];
                        console.log(changedSteps);
                        changedSteps = changedSteps.sort((step, nextStep) =>
                          step.order < nextStep.order ? 0 : 1
                        );

                        let stepIndex = changedSteps.findIndex(
                          (stepObject) => stepObject.id === step.id
                        );

                        if (stepIndex < changedSteps.length) {
                          changedSteps[stepIndex].order += 1;
                          changedSteps[stepIndex + 1].order -= 1;
                        }

                        console.log(changedSteps);
                        setNewSteps(changedSteps);
                      }}
                    >
                      <ChevronDownIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
                <input
                  className="text-2xl font-medium "
                  value={step.name}
                  onChange={(e) => {
                    let changedSteps = [...newSteps];

                    let stepIndex = changedSteps.findIndex(
                      (stepObject) => stepObject.id === step.id
                    );

                    changedSteps[stepIndex].name = e.target.value;

                    setNewSteps(changedSteps);
                  }}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  name="minute"
                  className="w-16 bg-green-100 text-primary rounded flex items-center justify-center text-lg"
                  value={step.time}
                  onChange={(e) => {
                    let changedSteps = [...newSteps];

                    let stepIndex = changedSteps.findIndex(
                      (stepObject) => stepObject.id === step.id
                    );

                    changedSteps[stepIndex].time = parseInt(e.target.value);

                    setNewSteps(changedSteps);
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    let changedSteps = [...newSteps];

                    let stepIndex = changedSteps.findIndex(
                      (stepObject) => stepObject.id === step.id
                    );

                    changedSteps.splice(stepIndex, 1);

                    for (let i = stepIndex; i < changedSteps.length; i++) {
                      changedSteps[i].order -= 1;
                    }

                    console.log(changedSteps);

                    setNewSteps(changedSteps);
                  }}
                >
                  <TrashIcon className="w-6 h-6 text-red-500 ml-4" />
                </button>{" "}
              </div>
            </div>
          ))}
      </form>
      <form className="w-full flex">
        <input
          type="text"
          className="w-full bg-gray-50 border-solid border-2 border-gray-200 rounded px-4 py-1 text-lg"
          value={newStep.name}
          onChange={(e) =>
            setNewStep((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <button
          type="submit"
          className="bg-primary-light text-white rounded w-24 ml-2"
          onClick={(e) => {
            e.preventDefault();
            setNewSteps((prev) => [...prev, newStep]);
            setNewStep((prev) => ({
              ...prev,
              name: "",
              time: 120,
              order: prev.order + 1,
            }));
          }}
        >
          Add New
        </button>
      </form>
    </div>
  );
}
