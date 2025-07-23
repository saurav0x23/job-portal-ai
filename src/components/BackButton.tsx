"use client";

import { Button } from "./ui/button";

export default function BackButton() {
  return (
    <Button
      variant={"outline"}
      onClick={() => window.history.back()}
      className="text-primary hover:underline"
    >
      Go Back
    </Button>
  );
}
