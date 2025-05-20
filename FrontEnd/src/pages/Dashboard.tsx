import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { MdDelete, MdEdit } from "react-icons/md";
import { getAllNotes, type AllNotes } from "@/lib/api";
import { useEffect, useState } from "react";

export const Dashboard = () => {
  const [notes, setNotes] = useState<AllNotes[]>([]);
  
  useEffect(() => {
    getAllNotes().then(setNotes);
  }, [notes]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-blue-500 font-serif underline">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <Card className="w-[300px] h-auto p-4" key={note._id}>
            <div className="flex flex-col justify-between gap-4">
              <CardTitle className="">{note.title}</CardTitle>
              <CardDescription className="">{note.content}</CardDescription>
            </div>

            <div className="btn flex justify-between">
              <div className="caption">
                <p className="text-xs font-medium text-gray-500">{note.caption}</p>
              </div>
              <div className="btn flex gap-5 justify-end">
                <MdEdit className="w-4 h-4 cursor-pointer text-blue-500 hover:text-blue-700" />
                <MdDelete className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Card,
// CardHeader,
// CardFooter,
// CardTitle,
// CardAction,
// CardDescription,
// CardContent,
