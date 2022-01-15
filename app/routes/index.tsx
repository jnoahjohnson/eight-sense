import { CogIcon } from "@heroicons/react/outline";
import { Step } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

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

export default function Index() {
  const { steps } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-end justify-between mb-4">
        <div className="mb-2 flex items-end">
          <h1 className="text-5xl font-bold select-none mr-2">Meditate</h1>
          <Link to="/notes" className="text-gray-500 text-lg">
            Notes
          </Link>
        </div>
        <Link to="/settings">
          <CogIcon className="w-8 h-8" />
        </Link>
      </div>
      <div className="space-y-3 mb-2">
        {steps.map((step) => (
          <div className="w-full px-4 py-2 flex items-center justify-between bg-gray-50 shadow rounded select-none">
            <p className="text-2xl font-medium">{step.name}</p>
            <p className="w-16 bg-green-100 text-primary rounded flex items-center justify-center">
              {step.time < 60
                ? `${step.time} sec`
                : `${Math.floor(step.time / 60)} min`}
            </p>
          </div>
        ))}
      </div>

      <div className="w-full flex items-center justify-center">
        <Link
          to="/meditate"
          className="px-4 py-2 rounded bg-primary text-white font-semibold text-lg"
        >
          Start
        </Link>
      </div>
    </div>
  );
}
