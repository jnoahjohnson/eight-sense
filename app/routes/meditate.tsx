import { XIcon } from "@heroicons/react/outline";
import { Step } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import Timer from "~/components/Timer";
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

export default function Meditate() {
  const { steps } = useLoaderData<LoaderData>();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full flex flex-col items-center justify-center">
      <Timer steps={steps} />
      <Link to="/" className="absolute top-4 right-4">
        <XIcon className="w-12 h-12 text-gray-400 hover:text-gray-500" />
      </Link>
      <div className="h-28" />
    </div>
  );
}
