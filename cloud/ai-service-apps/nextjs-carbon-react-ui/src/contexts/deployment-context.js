import { createContext, useState, useEffect } from "react";

export const DeploymentContext = createContext();

export const DeploymentProvider = ({ children }) => {
  const [deployment, setDeployment] = useState();

  useEffect(() => {
    const getDeployment = async () => {
      try {
        const result = await _getDeployment();
        setDeployment(result);
      } catch (err) {
        console.error(err);
      }
    };
    getDeployment();
  }, []);

  return <DeploymentContext.Provider value={deployment}>{children}</DeploymentContext.Provider>;
};

async function _getDeployment() {
  const response = await fetch("/api/deployment");
  if (!response.ok) {
    const { error } = await response.json();
    console.error(`Error while fetching deployment: ${error}`);
    return { name: "watsonx AI Service" };
  }
  return await response.json();
}
