import React, { useState, useContext } from "react";
import GenerateForm from "../components/forms/GenerateForm";
import * as mui from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../components/SnackbarProvider";
import Layout from "../components/layout/Layout";

function GeneratePage() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [generateOptions, setGenerateOptions] = useState({
    populationSize: "",
    gender: "all",
    minAge: "",
    maxAge: "",
    state: "",
    city: "",
  });

  const [runID, setRunID] = useState(null);
  const [loading, setLoading] = useState(false);


  const navigateRunOverview = () => navigate("/runs");

  /**
   * handleInput
   * Updates generateOptions state for each input field.
   */
  const handleInput = (e) => {
    const { name, value } = e.target;
    setGenerateOptions((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * isAgeInvalid
   * Checks these conditions:
   * 1) minAge and maxAge must both be filled if one is filled.
   * 2) minAge <= maxAge.
   * 3) Neither minAge nor maxAge can be negative.
   * 4) MaxAge cannot be greater than 120.
   */
  const minAgeValue =
    generateOptions.minAge !== "" ? parseInt(generateOptions.minAge) : null;
  const maxAgeValue =
    generateOptions.maxAge !== "" ? parseInt(generateOptions.maxAge) : null;

  const isAgeEmptyMismatch =
    (minAgeValue !== null && maxAgeValue === null) ||
    (maxAgeValue !== null && minAgeValue === null);

  const isAgeRangeInvalid =
    minAgeValue !== null &&
    maxAgeValue !== null &&
    (minAgeValue > maxAgeValue || minAgeValue < 0 || maxAgeValue < 0 || maxAgeValue > 120);

  const isAgeInvalid = isAgeEmptyMismatch || isAgeRangeInvalid;

  let ageErrorMessage = "";
  if(isAgeInvalid) {
    if (maxAgeValue > 120) {
        ageErrorMessage = "Maximum Age cannot exceed 120 years.";
    } else if (minAgeValue !== null && maxAgeValue !== null && minAgeValue > maxAgeValue) {
        ageErrorMessage = ("Min Age cannot be greater than Max Age.");
    } else {
        ageErrorMessage = "Both Min Age and Max Age must be filled correctly.";
    }
  }

  /**
   * isPopulationSizeInvalid
   * True if populationSize is not empty AND <= 0.
   */
  const isPopulationSizeInvalid =
    generateOptions.populationSize !== "" &&
    parseInt(generateOptions.populationSize) <= 0;

  /**
   * isFormInvalid
   * check for disabling the Generate button.
   */
  const isFormInvalid = isAgeInvalid || isPopulationSizeInvalid;

  /**
   * handleGenerate
   * Makes the API call to generate synthetic data.
   */
  const handleGenerate = async (event) => {
    event.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "/api/synthea/generate",
        {
          populationSize: generateOptions.populationSize || null,
          gender:
            generateOptions.gender !== "all" ? generateOptions.gender : null,
          minAge: generateOptions.minAge || null,
          maxAge: generateOptions.maxAge || 120,
          state: generateOptions.state || null,
          city: generateOptions.city || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.runID) {
        throw new Error("No Run ID returned from the server.");
      }

      setRunID(response.data.runID);
      showSnackbar(
        "Synthetic data generated and saved successfully!",
        "success"
      );
    } catch (error) {
      showSnackbar("Error generating or saving data.", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleReturn
   * Resets to the initial state or reloads the page.
   */
  const handleReturn = () => {
    window.location.reload();
  };

  return (
    <Layout>
      <mui.Typography variant="h2" gutterBottom textAlign="center" margin={5}>
        Generate a synthetic population
      </mui.Typography>
      <GenerateForm
        generateOptions={generateOptions}
        onInputChange={handleInput}
        onSubmit={handleGenerate}
        runID={runID}
        onReturn={handleReturn}
        loading={loading}
        isAgeInvalid={isAgeInvalid}
        ageErrorMessage={ageErrorMessage}
        isPopulationSizeInvalid={isPopulationSizeInvalid}
        isFormInvalid={isFormInvalid}
        navigateRunOverview={navigateRunOverview}
      />
    </Layout>
  );
}

export default GeneratePage;
