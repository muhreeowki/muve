export const saveState = (state) => {
  try {
    localStorage.setItem("appState", JSON.stringify(state));
    console.log("Saved State");
  } catch (err) {
    console.log(err);
  }
};

export const loadState = () => {
  try {
    const serialState = localStorage.getItem("appState");
    if (serialState === null) {
      return {};
    }
    console.log("Loaded State");
    return JSON.parse(serialState);
  } catch (err) {
    return {};
  }
};
