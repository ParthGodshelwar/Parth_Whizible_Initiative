import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import thoughts from "./thoughts.json"; // Adjust the path to your JSON file if necessary

const LoaderWithThoughts = () => {
  const [currentThought, setCurrentThought] = useState(thoughts[0]);
  let thoughtIndex = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      thoughtIndex = (thoughtIndex + 1) % thoughts.length;
      setCurrentThought(thoughts[thoughtIndex]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <CircularProgress />
      <Box mt={2} textAlign="center">
        {currentThought}
      </Box>
    </Box>
  );
};

export default LoaderWithThoughts;
