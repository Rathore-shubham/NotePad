import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiGrid, FiList } from "react-icons/fi";
// import TestTheme from "../components/TestTheme";
import { useTheme } from "../context/ThemeContext";

// import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchNotes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/notes", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          console.error("Failed to fetch notes");
          return;
        }

        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.log("Failed to fetch notes:", error);
      }
    };
    fetchNotes();

    if (location.state?.refresh) {
      fetchNotes();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleViewNote = (id) => {
    navigate(`/note/${id}`);
  };

  const handleDeleteNote = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((note) => note._id !== id));
      } else {
        console.error("failed to delete note");
      }
    } catch (error) {
      console.error("delete error:", error);
    }
  };

  const handleCreateNote = () => {
    navigate("/note");
  };

  const filteredNotes = Array.isArray(notes)
    ? notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* <Navbar/> */}
      <div
        className={`min-h-screen transition-all ${
          theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"
        }`}
      >
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-2">My Notes</h1>
          <p className="text-zinc-600">
            {notes.length} {notes.length === 1 ? "note" : "notes"} in your
            collection
          </p>

          {/* <TestTheme/> */}

          {/* Search and View Mode */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-6 ">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                theme === "dark"
                  ? "bg-zinc-800 text-white"
                  : "bg-white text-black"
              }`}
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => filteredNotes()}
                className={`px-4 py-2 shadow-lg rounded-md ${theme === 'dark' ? 'hover:bg-zinc-600': ''} `}
              >
                Filter
              </button>
              <div className={`flex  shadow-md rounded-lg overflow-hidden ${theme === 'dark' ? 'hover:bg-zinc-800': ''}` }>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-3 py-2 rounded ${
                    viewMode === "grid" ? "bg-zinc-500 font-bold" : ""
                  }`}
                >
                  <FiGrid className="text-lg" />
                  <span className="hidden sm:inline">Grid</span>
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-3 py-2 rounded ${
                    viewMode === "list" ? "bg-gray-500 font-bold" : ""
                  }`}
                >
                  <FiList className="text-lg" />
                  <span className="hidden sm:inline">List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notes List/Grid */}
          {filteredNotes.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className={`group p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] transform flex flex-col justify-between ${
                    theme === "dark"
                      ? "bg-gray-800 border-zinc-700 text-white"
                      : "bg-white border-gray-300 text-black"
                  }`}
                >
                  <h2
                    className={`text-lg font-semibold mb-1 ${
                      theme === "dark" ? "text-white" : "text-gray-800`"
                    }`}
                  >
                    {note.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 break-words">
                    {note.content || "no content"}
                  </p>
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => handleViewNote(note._id)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium  border border-blue-100 hover:bg-blue-50 transition ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium text-red-600 border border-red-100 hover:bg-red-50 transition${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-red-600'}`}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                🔍
              </div>
              <h3 className="text-lg font-semibold mb-2">No notes found</h3>
              <p className="text-gray-600">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first note to get started"}
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <button
          onClick={handleCreateNote}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 text-white text-2xl flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-200"
        >
          +
        </button>
      </div>
    </div>
  );
}
