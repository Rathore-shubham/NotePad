import { Link } from "react-router-dom";
import React from "react";

const NoteCard = ({ note }) => {
  return (
    <Link
      to={`/note/${note._id}`}
      className="group block rounded-lg border border-border/50 bg-card text-card-foreground shadow transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
    >
      {/* Card Header */}
      <div className="flex flex-col bg-zinc-900 space-y-1.5 p-6 pb-3">
        <div className="flex items-start justify-between">
          <h2 className="text-base font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {note.title}
          </h2>
          <button className="opacity-0 group-hover:opacity-100 h-8 w-8 rounded-md transition-opacity flex items-center justify-center">
            ⋮
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-6 pb-3">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {note.content}
        </p>
      </div>

     
    </Link>
  );
};

export default NoteCard;
