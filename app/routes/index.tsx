import { Step } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  steps: Step[];
};

export let loader: LoaderFunction = async () => {
  let steps = await db.step.findMany({
    orderBy: [
      {
        order: "asc",
      },
    ],
  });

  const data: LoaderData = {
    steps,
  };

  return data;
};

export default function Index() {
  const { steps } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-5xl font-bold mb-4 select-none">Meditate</h1>
      <div className="space-y-3 mb-2">
        {steps.map((step) => (
          <div className="w-full px-4 py-2 flex items-center justify-between bg-gray-50 shadow rounded select-none">
            <p className="text-2xl font-medium">{step.name}</p>
            <p className="w-16 bg-blue-100 text-blue-800 rounded flex items-center justify-center">
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
          className="px-4 py-2 rounded bg-blue-800 text-white font-semibold text-lg"
        >
          Start
        </Link>
      </div>
    </div>
  );
}
