"use client";

import { useState } from "react";
import { deleteVehicle } from "@/app/actions/vehicle";

export default function DeleteTestButton() {
  const [result, setResult] = useState<string | null>(null);

  async function handleClick() {
    try {
      await deleteVehicle("test-vehicle-id");
      setResult("✅ Action ran without Unauthorized error (role check passed)");
    } catch (err) {
      setResult(err instanceof Error ? `❌ ${err.message}` : "Unknown error");
    }
  }

  return (
    <div style={{ padding: "1rem", border: "1px dashed gray", margin: "1rem 0" }}>
      <button onClick={handleClick}>Test deleteVehicle action</button>
      {result && <p>{result}</p>}
    </div>
  );
}