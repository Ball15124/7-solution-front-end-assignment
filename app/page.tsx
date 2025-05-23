"use client";
import { useState, useRef, useEffect } from "react";
import { transformUsersByDepartment } from "./services/transformUsersByDepartment";

type CardItem = {
  type: "Fruit" | "Vegetable";
  name: string;
};

const cards: CardItem[] = [
  { type: "Fruit", name: "Apple" },
  { type: "Vegetable", name: "Broccoli" },
  { type: "Vegetable", name: "Mushroom" },
  { type: "Fruit", name: "Banana" },
  { type: "Vegetable", name: "Tomato" },
  { type: "Fruit", name: "Orange" },
  { type: "Fruit", name: "Mango" },
  { type: "Fruit", name: "Pineapple" },
  { type: "Vegetable", name: "Cucumber" },
  { type: "Fruit", name: "Watermelon" },
  { type: "Vegetable", name: "Carrot" },
];

export default function Home() {
  const [allItems, setAllItems] = useState<CardItem[]>(cards);
  const [fruits, setFruits] = useState<CardItem[]>([]);
  const [vegetables, setVegetables] = useState<CardItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const timers = useRef<Record<string, NodeJS.Timeout>>({});
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    if (isOpen && data === null) {
      (async () => {
        const result = await transformUsersByDepartment();
        setData(result);
      })();
    }
  }, [isOpen]);

  const handleClick = (item: CardItem) => {
    setAllItems((prev) => prev.filter((i) => i.name !== item.name));

    if (item.type === "Fruit") {
      setFruits((prev) => [...prev, item]);
    } else if (item.type === "Vegetable") {
      setVegetables((prev) => [...prev, item]);
    }

    timers.current[item.name] = setTimeout(() => {
      if (item.type === "Fruit") {
        setFruits((prev) => prev.filter((i) => i.name !== item.name));
      } else {
        setVegetables((prev) => prev.filter((i) => i.name !== item.name));
      }
      setAllItems((prev) => [...prev, item]);
    }, 5000);
  };

  const handleReturn = (item: CardItem) => {
    if (timers.current[item.name]) {
      clearTimeout(timers.current[item.name]);
      delete timers.current[item.name];
    }

    if (item.type === "Fruit") {
      setFruits((prev) => prev.filter((i) => i.name !== item.name));
    } else {
      setVegetables((prev) => prev.filter((i) => i.name !== item.name));
    }

    setAllItems((prev) => [...prev, item]);
  };

  return (
    <div className="h-screen p-5 md:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1
        className="text-center hover:font-bold cursor-pointer"
        onClick={() => {
          if (isOpen === false) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
        {isOpen === true ? "Close API" : "Display API"}
      </h1>
      <div className={`${isOpen === true ? "block" : "hidden"}`}>
        {data ? (
          <pre className="bg-gray-100 p-4 text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
            <div
              className="text-center hover:font-bold cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Close API
            </div>
          </pre>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
            <h1 className="text-center">Auto Delete Todo-list</h1>
      <div className="flex flex-col md:flex-row w-full gap-5 mt-5 h-full pb-5">
        <div className="grid grid-cols-3 gap-2 md:grid-cols-1 w-full h-fit">
          {allItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleClick(item)}
              className="bg-white p-2 shadow text-center cursor-pointer hover:scale-105 border-[1px] border-gray-200"
            >
              {item.name}
            </div>
          ))}
        </div>
        <div className="flex flex-col w-full border-[1px] border-black h-full md:h-4/5">
          <div className="bg-slate-400 border-b-[1px] border-black text-center p-4">
            Fruits
          </div>
          <div className="p-2 space-y-2">
            {fruits.map((item, index) => (
              <div
                key={index}
                onClick={() => handleReturn(item)}
                className="bg-white p-2 shadow text-center cursor-pointer hover:bg-gray-400 border-[1px] border-gray-200"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-full border-[1px] border-black h-full md:h-4/5">
          <div className="bg-slate-400 border-b-[1px] border-black text-center p-4">
            Vegetables
          </div>
          <div className="p-2 space-y-2">
            {vegetables.map((item, index) => (
              <div
                key={index}
                onClick={() => handleReturn(item)}
                className="bg-white p-2 shadow text-center cursor-pointer hover:bg-gray-400 border-[1px] border-gray-200"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
