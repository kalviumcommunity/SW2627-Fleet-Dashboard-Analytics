"use client";

import { useState, useTransition } from "react";
import { addVehicle } from "@/app/actions/vehicle";
import styles from "./AddVehicleForm.module.css";

export default function AddVehicleForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const registrationNumber = formData.get("registrationNumber") as string;
    const status = formData.get("status") as "active" | "idle" | "offline";
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);

    startTransition(async () => {
      try {
        await addVehicle({ name, registrationNumber, status, lat, lng });
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add vehicle");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Add Vehicle</h2>

      <div className={styles.grid}>
        <input name="name" required placeholder="Vehicle name" className={styles.input} />
        <input
          name="registrationNumber"
          required
          placeholder="Registration number"
          className={styles.input}
        />
        <select name="status" required className={styles.input} defaultValue="active">
          <option value="active">Active</option>
          <option value="idle">Idle</option>
          <option value="offline">Offline</option>
        </select>
        <input
          name="lat"
          type="number"
          step="any"
          required
          placeholder="Latitude"
          className={styles.input}
        />
        <input
          name="lng"
          type="number"
          step="any"
          required
          placeholder="Longitude"
          className={styles.input}
        />
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>Vehicle added successfully.</p>}

      <button type="submit" disabled={isPending} className={styles.submitButton}>
        {isPending ? "Adding..." : "Add Vehicle"}
      </button>
    </form>
  );
}