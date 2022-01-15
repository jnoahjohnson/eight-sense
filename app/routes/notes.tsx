import { Note } from "@prisma/client";
import { Link, LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  let notes = await db.note.findMany({
    where: {
      userId,
    },
  });

  return {
    notes,
  };
};

export default function NotesRoute() {
  let { notes } = useLoaderData<{ notes: Note[] }>();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-2 flex items-end">
        <h1 className="text-5xl font-bold select-none mr-2">Notes</h1>
        <Link to="/" className="text-gray-500 text-lg">
          Meditate
        </Link>
      </div>
      <div className="space-y-2">
        {notes.map((note) => (
          <div className="w-full py-8 px-2 bg-gray-50 rounded">
            <p>{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
