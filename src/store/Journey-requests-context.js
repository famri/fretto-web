import { createContext, useState } from "react";

const JourneyRequestsContext = createContext({
  sortCriterion: "date-time,desc",
  periodCriterion: "m1",

  pageNumber: 0,
  setSortCriterion: (sortCriterion) => {},
  setPeriodCriterion: (periodCriterion) => {},

  setPageNumber: (pageNumber) => {},
});

export const JourneyRequestsContextProvider = (props) => {
  const [sortCriterion, setSortCriterion] = useState("date-time,desc");
  const [periodCriterion, setPeriodCriterion] = useState("m1");

  const [pageNumber, setPageNumber] = useState(0);

  const contextValue = {
    sortCriterion: sortCriterion,
    periodCriterion: periodCriterion,

    pageNumber: pageNumber,
    setSortCriterion: (newSortCriterion) =>
      setSortCriterion((oldSortCriterion) => newSortCriterion),
    setPeriodCriterion: (newPeriodCriterion) =>
      setPeriodCriterion((oldPeriodCriterion) => newPeriodCriterion),

    setPageNumber: (newPageNumber) =>
      setPageNumber((pageNumber) => newPageNumber),
  };

  return (
    <JourneyRequestsContext.Provider value={contextValue}>
      {props.children}
    </JourneyRequestsContext.Provider>
  );
};

export default JourneyRequestsContext;
