import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { jsPDF } from "jspdf";
import { useTheme } from "../context/ThemeContext";

export default function Note() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    const method = id ? "PUT" : "POST";
    const url = id
      ? `http://localhost:5000/api/notes/${id}`
      : "http://localhost:5000/api/notes";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      setLastSaved(new Date());
      console.log("Note Saved");

      setTimeout(() => {
        navigate("/dashboard", { state: { refresh: true } });
      }, 500);
    } else {
      console.error("save failed");
    }
  };

  useEffect(() => {
    if (id) {
      const fetchNote = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await fetch(
            `http://localhost:5000/api/notes/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("Unauthorized or failed to fetch");
          }

          const data = await response.json();
          setTitle(data.title || "");
          setContent(data.content || "");
        } catch (error) {
          console.error("Failed to fetch note:", error);
        }
      };

      fetchNote();
    }
  }, [id]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Title: ${title || "untitled"}`, 10, 10);

    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content || "", 180);
    doc.text(lines, 10, 20);

    doc.save(`${title || "untitled"}.pdf`);
  };

  const handleDownloadTXT = () => {
    const file = new Blob([`Title: ${title}\n\n${content}`], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "untitled"}.txt `;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen transition-all ${
        theme === "dark" ? "bg-zinc-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-5 bg-opacity-95 backdrop-blur shadow-sm ${
          theme === "dark" ? "bg-zinc-900 text-white" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 border">
                  ←
                </button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="text-xl font-semibold text-blue-600">📝</div>
                <span className="font-medium">{title || "Untitled Note"}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {lastSaved && (
                <span className="text-xs text-gray-500 hidden sm:block">
                  Saved {lastSaved.toLocaleTimeString()}
                </span>
              )}

              <button
                onClick={handleDownloadTXT}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
              >
                TXT
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-100"
              >
                PDF
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <main className="max-w-5xl mx-auto shadow-lg px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`space-y-6${
            theme === "dark" ? "bg-zinc-900 text-white" : ""
          }`}
        >
          {/* Title Input */}
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 text-2xl font-bold outline-none border-b shadow-lg border-gray-300 pb-2 placeholder-gray-400"
          />

          {/* Content Textarea */}
          <textarea
            placeholder="Start writing your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[600px] resize-none border border-gray-300 rounded-lg shadow-lg p-4 outline-none focus:ring-2 focus:ring-blue-300 hover:shadow-lg"
          />
        </div>

        {/* Auto-save message */}
        <div className="mt-4 text-center">
          <p className="text-xs  text-black-500">
            Changes are auto-saved every 30 seconds
          </p>
        </div>
      </main>
    </div>
  );
}
