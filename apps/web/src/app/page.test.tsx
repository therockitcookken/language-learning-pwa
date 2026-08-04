import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("home page", () => {
  it("introduces Factory Language Academy for factory workers", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /học tiếng trung & tiếng anh công xưởng/i,
      }),
    ).toBeInTheDocument();
  });
});
