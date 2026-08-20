"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { STATES, districtsOf, subDistrictsOf } from "@/lib/data/locations";

interface Props {
  initial: {
    state: string;
    district: string;
    subDistrict: string;
    checkIn: string;
    checkOut: string;
  };
}

export function HeroSearch({ initial }: Props) {
  const router = useRouter();
  const [state, setState] = useState(initial.state);
  const [district, setDistrict] = useState(initial.district);
  const [subDistrict, setSubDistrict] = useState(initial.subDistrict);
  const [checkIn, setCheckIn] = useState(initial.checkIn);
  const [checkOut, setCheckOut] = useState(initial.checkOut);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (state) params.set("state", state);
    if (district) params.set("district", district);
    if (subDistrict) params.set("subDistrict", subDistrict);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    router.push(`/?${params}#farmstays`);
  }

  return (
    <form
      onSubmit={submit}
      className="grid gap-4 rounded-lg bg-white p-5 shadow-xl sm:grid-cols-2 lg:grid-cols-6 lg:items-end lg:gap-3"
    >
      <Field label="State">
        {(id) => (
          <Select
            id={id}
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              setDistrict("");
              setSubDistrict("");
            }}
          >
            <option value="">Any state</option>
            {STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field label="District">
        {(id) => (
          <Select
            id={id}
            value={district}
            disabled={!state}
            onChange={(e) => {
              setDistrict(e.target.value);
              setSubDistrict("");
            }}
          >
            <option value="">Any district</option>
            {districtsOf(state).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field label="Sub-district">
        {(id) => (
          <Select
            id={id}
            value={subDistrict}
            disabled={!district}
            onChange={(e) => setSubDistrict(e.target.value)}
          >
            <option value="">Any sub-district</option>
            {subDistrictsOf(state, district).map((sd) => (
              <option key={sd} value={sd}>
                {sd}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field label="Check-in">
        {(id) => (
          <Input
            id={id}
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        )}
      </Field>

      <Field label="Check-out">
        {(id) => (
          <Input
            id={id}
            type="date"
            min={checkIn || undefined}
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        )}
      </Field>

      <Button type="submit" size="md" className="sm:col-span-2 lg:col-span-1">
        Search Farms
      </Button>
    </form>
  );
}
