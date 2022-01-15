import { XIcon } from "@heroicons/react/outline";
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
import Timer from "~/components/Timer";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export let action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  let formData = await request.formData();
  let noteText = formData.get("noteText");

  if (typeof noteText !== "string") {
    throw Error("Not a valid note");
  }

  await db.note.create({
    data: {
      text: noteText,
      user: {
        connect: {
          id: userId,
        },
      },
      step: {
        connect: {
          id: "694d9f52-281b-4802-a1ec-e4681d1254a3",
        },
      },
    },
  });

  return redirect("/meditate");
};

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
  const transition = useTransition();
  const [noteText, setNoteText] = useState<string>("");

  useEffect(() => {
    if (transition.state === "loading") {
      setNoteText("");
    }
  }, [transition.state]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 h-full flex flex-col items-center justify-center">
      <Timer steps={steps} />
      <Form
        method="post"
        className="w-full mt-16 flex flex-col items-center justify-center space-y-2"
      >
        <textarea
          name="noteText"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          className="mx-auto w-full border-2 border-solid border-gray-200 rounded resize-none p-2"
        />
        <button
          type="submit"
          disabled={transition.state === "submitting"}
          className="bg-primary text-white px-2 py-1 rounded text-lg disabled:bg-primary-light"
        >
          Add Note
        </button>
      </Form>
      <Link to="/" className="absolute top-4 right-4">
        <XIcon className="w-12 h-12 text-gray-400 hover:text-gray-500" />
      </Link>
    </div>
  );
}
