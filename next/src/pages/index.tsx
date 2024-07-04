import AddAmmounForms from "@/components/AddAmmounForms";
import QuerySecretForms from "@/components/QuerySecretForms";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { SetStateAction, useState } from "react";

export default function Home() {
  const [activeComponent, setActiveComponent] = useState("connect");

  const handleNavigation = (component: SetStateAction<string>) => {
    setActiveComponent(component);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24  bg-gray-800 ">
      <nav className="w-full p-4 text-white fixed top-0">
        <div className="flex justify-around">
          <ConnectButton />
        </div>
        <div className="flex justify-center gap-10">
          <button
            onClick={() => handleNavigation("add")}
            className={`p-2 ${
              activeComponent === "add" ? "border-b-4 border-blue-500" : ""
            }`}
          >
            Add Amount
          </button>
          <button
            onClick={() => handleNavigation("query")}
            className={`p-2 ${
              activeComponent === "query" ? "border-b-4 border-blue-500" : ""
            }`}
          >
            Query Secret
          </button>
        </div>
      </nav>
      <div className="mt-8 w-full">
        {activeComponent === "add" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <AddAmmounForms />
          </motion.div>
        )}
        {activeComponent === "query" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center"
          >
            <QuerySecretForms />
          </motion.div>
        )}
      </div>
    </main>
  );
}
