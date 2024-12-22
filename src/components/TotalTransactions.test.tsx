import { render, screen, within } from "@testing-library/react";
import TestProvider from "tests-utils";
import TotalTransactions, { TotalTransactionsProps } from "./TotalTransactions";

describe("TotalTransactions", () => {
  const tree = (props: TotalTransactionsProps) => {
    return render(
      <TestProvider>
        <TotalTransactions {...props} />
      </TestProvider>
    );
  };

  it("should render the total transactions text", () => {
    tree({ GCS: 0, ICS: 0 });
    expect(screen.getByText("Total transactions")).toBeVisible();
  });

  it("should render GCS and ICS values correctly", () => {
    tree({ GCS: 1234.567, ICS: 8901.234 });
    expect(
      within(screen.getByText("GCS:")).getByText("1,234.567")
    ).toBeInTheDocument();
    expect(
      within(screen.getByText("ICS:")).getByText("8,901.234")
    ).toBeInTheDocument();
  });
});
