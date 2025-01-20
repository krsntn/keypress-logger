"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "./ui/checkbox";

interface KeyPress {
  id: number;
  key: string;
  type: string;
  timestamp: number;
  textColor?: string;
}

const COLOR_LIST = [
  "text-red-600",
  "text-teal-600",
  "text-blue-600",
  "text-amber-500",
  "text-green-600",
  "text-violet-600",
  "text-yellow-500",
  "text-indigo-600",
  "text-pink-600",
  "text-lime-600",
  "text-rose-600",
  "text-fuchsia-600",
  "text-cyan-600",
  "text-orange-600",
];

export default function KeypressLogger() {
  const [keypresses, setKeypresses] = useState<KeyPress[]>([]);
  const [autoFadeOut, setAutoFadeOut] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const newKeypress: KeyPress = {
        id: Date.now(),
        key: event.code,
        type: event.type,
        timestamp: Date.now(),
      };

      const prev = keypresses.find((x) => x.key === event.code);
      if (prev) {
        newKeypress.textColor = prev.textColor;
      } else {
        const set = new Set(keypresses.map((x) => x.key));
        newKeypress.textColor = COLOR_LIST[set.size % COLOR_LIST.length];
      }

      setKeypresses((prevKeypresses) => [...prevKeypresses, newKeypress]);

      setTimeout(() => {
        document
          .querySelector("#logBox")
          ?.scroll({ top: document.querySelector("#logBox")?.scrollHeight });
      }, 50);
    };

    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, [keypresses]);

  useEffect(() => {
    if (!autoFadeOut) return;

    const timer = setInterval(() => {
      const now = Date.now();
      setKeypresses((prevKeypresses) =>
        prevKeypresses.filter((keypress) => now - keypress.timestamp < 3000),
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [autoFadeOut]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Keypress Logger</h1>
      <div className="flex items-center space-x-2 mb-2">
        <Checkbox
          id="fade-out"
          onCheckedChange={(checked) => setAutoFadeOut(!!checked)}
          checked={autoFadeOut}
        />
        <label
          htmlFor="fade-out"
          className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Each keypress will fade out after 3 seconds.
        </label>
      </div>

      <div className="relative">
        <motion.div
          layout
          id="logBox"
          className="bg-white shadow-md rounded-lg p-2 overflow-y-auto overflow-x-hidden flex flex-col h-[500px]"
          style={{
            minHeight: keypresses.length ? "100px" : "0px",
          }}
        >
          <AnimatePresence>
            {keypresses.map((keypress) => (
              <motion.div
                key={keypress.id}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20, transition: { duration: 0.3 } }}
              >
                <span className="font-mono text-gray-800">
                  [{keypress.type}]{" "}
                </span>
                <span className={`font-mono ${keypress.textColor}`}>
                  {keypress.key}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {keypresses.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.5 }}
              className="text-gray-400 text-center mt-12"
            >
              No keypresses logged
            </motion.p>
          )}
        </motion.div>

        {keypresses.length !== 0 && (
          <button
            type="button"
            className="flex justify-center gap-2 rounded w-full bg-gray-400 p-2 mt-2"
            onClick={() => setKeypresses([])}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
