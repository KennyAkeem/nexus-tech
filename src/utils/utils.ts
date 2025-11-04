const getImagePrefix = () => {
  return process.env.NODE_ENV === "production"
    ? "/nexus-tech/"
    : "";
};

export { getImagePrefix };
 
