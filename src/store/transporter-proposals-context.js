import { createContext, useState } from "react";

const TransporterProposalsContext = createContext({
  sortCriterion: "price,desc",
  periodCriterion: "m1",
  statusKey: "ALL",
  pageNumber: 0,
  setSortCriterion: (sortCriterion) => {},
  setPeriodCriterion: (periodCriterion) => {},
  setStatusKey: (newStatusKey) => {},
  calculateStatuses: (key) => {},
  setPageNumber: (pageNumber) => {},
});

export const TransporterProposalsContextProvider = (props) => {
  const [sortCriterion, setSortCriterion] = useState("price,desc");
  const [periodCriterion, setPeriodCriterion] = useState("m1");
  const [statusKey, setStatusKey] = useState("ALL");
  const [pageNumber, setPageNumber] = useState(0);

  const calculateStatuses = (key) => {
    switch (key) {
      case "ALL":
        return ["SUBMITTED", "ACCEPTED", "REJECTED", "CANCELED"];
      case "SUBMITTED":
        return ["SUBMITTED"];
      case "ACCEPTED":
        return ["ACCEPTED"];
      case "REJECTED":
        return ["REJECTED"];
      case "CANCELED":
        return ["CANCELED"];
      default:
        return [];
    }
  };
  const contextValue = {
    sortCriterion: sortCriterion,
    periodCriterion: periodCriterion,
    statusKey: statusKey,
    pageNumber: pageNumber,
    setSortCriterion: (newSortCriterion) =>
      setSortCriterion((oldSortCriterion) => newSortCriterion),
    setPeriodCriterion: (newPeriodCriterion) =>
      setPeriodCriterion((oldPeriodCriterion) => newPeriodCriterion),

    setPageNumber: (newPageNumber) =>
      setPageNumber((pageNumber) => newPageNumber),
    setStatusKey: (newStatusKey) =>
      setStatusKey((oldStatusKey) => newStatusKey),
    calculateStatuses: calculateStatuses,
  };

  return (
    <TransporterProposalsContext.Provider value={contextValue}>
      {props.children}
    </TransporterProposalsContext.Provider>
  );
};

export default TransporterProposalsContext;
