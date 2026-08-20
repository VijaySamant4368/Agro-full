"use client";

import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";

export interface Personal {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Props {
  value: Personal;
  onChange: (next: Personal) => void;
}

export function PersonalDetails({ value, onChange }: Props) {
  const set = (key: keyof Personal) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...value, [key]: e.target.value });

  return (
    <Card>
      <CardHeader title="Personal Details" icon={<UserRound size={22} />} />
      <CardBody>
        <div className="flex items-center gap-4">
          <div className="grid size-20 place-items-center rounded-md bg-black/[0.06] text-ink-muted">
            <UserRound size={36} aria-hidden />
          </div>
          <Button type="button" variant="outline" size="sm">
            Change Photo
          </Button>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Field label="First Name">
            {(id) => <Input id={id} autoComplete="given-name" value={value.firstName} onChange={set("firstName")} />}
          </Field>
          <Field label="Last Name">
            {(id) => <Input id={id} autoComplete="family-name" value={value.lastName} onChange={set("lastName")} />}
          </Field>
        </div>

        <Field label="Email Address" className="mt-5">
          {(id) => (
            <Input id={id} type="email" autoComplete="email" value={value.email} onChange={set("email")} />
          )}
        </Field>

        <Field
          label="Phone Number (For Alerts)"
          className="mt-5"
          hint="Used for emergency SMS notifications during travel."
        >
          {(id) => (
            <Input id={id} type="tel" autoComplete="tel" value={value.phone} onChange={set("phone")} />
          )}
        </Field>
      </CardBody>
    </Card>
  );
}
