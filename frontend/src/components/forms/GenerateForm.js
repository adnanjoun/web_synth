import React from "react";
import * as mui from "@mui/material";
import demographicsAustria from "../../data/demographicsAustria";
import { ArrowLeft, InfoOutlined } from "@mui/icons-material";

function GenerateForm({
  generateOptions,
  onInputChange,
  onSubmit,
  runID,
  onDownload,
  onReturn,
  loading,
  downloading,
  generationTime,
  isAgeInvalid,
  ageErrorMessage,
  isPopulationSizeInvalid,
  isFormInvalid,
}) {
  const { populationSize, gender, minAge, maxAge, state, city } =
    generateOptions;

  return (
    <mui.Box
      sx={{
        backgroundColor: "background.secondary",
        padding: 5,
        borderRadius: 6,
        boxShadow: 4,
        maxWidth: 500,
        margin: "auto",
      }}
    >
      {/* If runID is not generated yet, then it shows the input form first */}
      {!runID ? (
        <mui.Box
          component="form"
          onSubmit={onSubmit}
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <mui.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <mui.TextField
              label="Population size"
              type="number"
              name="populationSize"
              value={populationSize}
              onChange={onInputChange}
              error={isPopulationSizeInvalid}
              helperText={
                isPopulationSizeInvalid
                  ? "Population size must be greater than 0"
                  : ""
              }
              fullWidth
            />
            <mui.Tooltip title="Enter the total number of people to generate.">
              <InfoOutlined color="info" />
            </mui.Tooltip>
          </mui.Box>

          <mui.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <mui.TextField
              select
              label="Gender"
              name="gender"
              value={gender}
              onChange={onInputChange}
              fullWidth
            >
              <mui.MenuItem value="all">All</mui.MenuItem>
              <mui.MenuItem value="M">Male</mui.MenuItem>
              <mui.MenuItem value="F">Female</mui.MenuItem>
            </mui.TextField>
            <mui.Tooltip title="Select the gender for the generated population.">
              <InfoOutlined color="info" />
            </mui.Tooltip>
          </mui.Box>

          <mui.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <mui.TextField
              label="Minimum Age"
              type="number"
              name="minAge"
              value={minAge}
              onChange={onInputChange}
              error={isAgeInvalid}
              helperText={
                isAgeInvalid
                  ? ageErrorMessage
                  : ""
              }
              fullWidth
            />
            <mui.Tooltip title="Specify the minimum age. If filled, Maximum Age must also be set.">
              <InfoOutlined color="info" />
            </mui.Tooltip>
          </mui.Box>

          <mui.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <mui.TextField
              label="Maximum Age"
              type="number"
              name="maxAge"
              value={maxAge}
              onChange={onInputChange}
              error={isAgeInvalid}
              helperText={
                isAgeInvalid
                  ? ageErrorMessage
                  : ""
              }
              fullWidth
            />
            <mui.Tooltip title="Specify the maximum age. If filled, Minimum Age must also be set.">
              <InfoOutlined color="info" />
            </mui.Tooltip>
          </mui.Box>

          <mui.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <mui.TextField
              select
              label="Federal state"
              name="state"
              value={state}
              onChange={onInputChange}
              fullWidth
            >
              {[...demographicsAustria.keys()].map((stateOption) => (
                <mui.MenuItem key={stateOption} value={stateOption}>
                  {stateOption}
                </mui.MenuItem>
              ))}
            </mui.TextField>
            <mui.Tooltip title="Select the federal state for the generated population.">
              <InfoOutlined color="info" />
            </mui.Tooltip>
          </mui.Box>

          {state && (
            <mui.Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <mui.TextField
                select
                label={
                  state === "Wien"
                    ? "District"
                    : "City/Municipality/Market town"
                }
                name="city"
                value={city}
                onChange={onInputChange}
                fullWidth
              >
                {demographicsAustria.get(state)?.map((cityOption) => (
                  <mui.MenuItem key={cityOption} value={cityOption}>
                    {cityOption}
                  </mui.MenuItem>
                ))}
              </mui.TextField>
              <mui.Tooltip title="Select a specific location within the chosen federal state.">
                <InfoOutlined color="info" />
              </mui.Tooltip>
            </mui.Box>
          )}

          <mui.Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <mui.Button
              type="submit"
              variant="contained"
              sx={{ width: "150px" }}
              disabled={loading || isFormInvalid}
            >
              {loading ? (
                <mui.Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  Generating...
                  <mui.CircularProgress size={20} />
                </mui.Box>
              ) : (
                "Generate"
              )}
            </mui.Button>
          </mui.Box>
        </mui.Box>
      ) : (
        // If run is generated, it shows the download screen
        <mui.Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <mui.Typography
            variant="body1"
            sx={{
              display: "flex",
              alignItems: "center",
              color: "primary.main",
              cursor: "pointer",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
              mt: -2,
              mb: 1,
            }}
            onClick={onReturn}
          >
            <ArrowLeft />
            Return to Generator
          </mui.Typography>

          <mui.Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
            }}
          >
            <mui.Typography
              variant="h3"
              sx={{ textAlign: "center", fontWeight: "bold" }}
            >
              Done!
            </mui.Typography>

            <mui.Box sx={{ textAlign: "left" }}>
              <mui.List sx={{ listStyleType: "disc" }}>
                <mui.ListItem sx={{ display: "list-item", paddingLeft: 0 }}>
                  <mui.Typography variant="body1">
                    Synthetic data generation finished in {generationTime}{" "}
                    seconds.
                  </mui.Typography>
                </mui.ListItem>
                <mui.ListItem sx={{ display: "list-item", paddingLeft: 0 }}>
                  <mui.Typography variant="body1">
                    Generated population size: {populationSize || 1}.
                  </mui.Typography>
                </mui.ListItem>
              </mui.List>
            </mui.Box>

            <mui.Box sx={{ display: "flex", gap: 4, justifyContent: "center" }}>
              <mui.Button
                onClick={() => onDownload("csv")}
                variant="contained"
                disabled={downloading}
              >
                Download CSV
              </mui.Button>
              <mui.Button
                onClick={() => onDownload("fhir")}
                variant="contained"
                disabled={downloading}
              >
                Download FHIR
              </mui.Button>
            </mui.Box>
          </mui.Box>
        </mui.Box>
      )}
    </mui.Box>
  );
}

export default GenerateForm;
