export const createRequestCounter = () => {
  let count = 0;

  return {
    increment: () => {
      count += 1;
    },
    count: () => count,
  };
};
