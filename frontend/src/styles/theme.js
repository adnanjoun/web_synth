import { createTheme } from "@mui/material/styles";

const designTokens = {
  colors: {
    background: {
      default: "#2c2c2c",
      secondary: "#3c3c3c",
    },
    primary: {
      main: "#03a78e",
      hover: "#00b3b3",
    },
    secondary: {
      main: "#00b3b3",
    },
    text: {
      primary: "#ffffff",
      secondary: "#d1d1d1",
      dark: "#2c2c2c",
    },
    border: {
      default: "#5a5a5a",
      hover: "#00b3b3",
    },
  },
  borderRadius: {
    small: "10px",
    medium: "15px",
  },
  spacing: {
    small: "10px",
    medium: "16px",
    large: "20px",
  },
};

const theme = createTheme({
  palette: {
    background: designTokens.colors.background,
    primary: designTokens.colors.primary,
    secondary: designTokens.colors.secondary,
    text: designTokens.colors.text,
  },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
      color: designTokens.colors.text.primary,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
      color: designTokens.colors.text.primary,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
      color: designTokens.colors.text.primary,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      color: designTokens.colors.text.primary,
    },
    body2: {
      fontSize: "1rem",
      fontWeight: 200,
      color: designTokens.colors.text.primary,
    },
    button: {
      fontSize: "1rem",
      fontWeight: 700,
      textTransform: "none",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.primary.main,
          color: designTokens.colors.text.primary,
          borderRadius: designTokens.borderRadius.medium,
          padding: `${designTokens.spacing.small} ${designTokens.spacing.large}`,
          "&:hover": {
            backgroundColor: designTokens.colors.primary.hover,
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        InputProps: {
          inputProps: {
            min: 0,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.background.secondary,
          borderRadius: designTokens.borderRadius.medium,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: designTokens.colors.primary.main,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: designTokens.colors.primary.hover,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: designTokens.colors.primary.main,
          },
        },
        input: {
          color: designTokens.colors.text.primary,
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: designTokens.colors.text.secondary,
          "&.Mui-focused": {
            color: designTokens.colors.text.primary,
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.background.secondary,
          borderRadius: designTokens.borderRadius.small,
          fontSize: "0.9rem",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: designTokens.colors.primary.main,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: designTokens.colors.primary.hover,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: designTokens.colors.primary.main,
          },
        },
        icon: {
          color: designTokens.colors.text.primary,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: designTokens.colors.background.default,
          borderRadius: designTokens.borderRadius.small,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          maxHeight: "200px",
          overflowY: "auto",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: designTokens.colors.text.primary,
          fontSize: "0.9rem",
          padding: `${designTokens.spacing.small} ${designTokens.spacing.medium}`,
          "&:hover": {
            backgroundColor: designTokens.colors.primary.main,
          },
          "&.Mui-selected": {
            backgroundColor: designTokens.colors.primary.main,
            "&:hover": {
              backgroundColor: designTokens.colors.primary.hover,
            },
          },
          "&:not(:last-child)": {
            borderBottom: `1px solid ${designTokens.colors.border.default}`,
          },
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.background.secondary,
          borderRadius: designTokens.borderRadius.small,
          maxHeight: 500,
          overflowY: "auto",
          maxWidth: "1200px",
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "6px",
            width: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: designTokens.colors.primary.main,
            borderRadius: designTokens.borderRadius.small,
            border: `2px solid ${designTokens.colors.background.secondary}`,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: designTokens.colors.primary.hover,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: designTokens.colors.background.default,
          },
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.primary.main,
          position: "sticky",
          top: 0,
          zIndex: 3,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: `${designTokens.spacing.small} ${designTokens.spacing.medium}`,
          borderBottom: `1px solid ${designTokens.colors.border.default}`,
          textAlign: "center",
        },
        head: {
          fontWeight: "bold",
          textAlign: "center",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: designTokens.borderRadius.medium,
          padding: designTokens.spacing.medium,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
          backgroundColor: designTokens.colors.background.default,
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: designTokens.colors.background.default,
          textAlign: "center",
          fontWeight: "bold",
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          justifyContent: "right",
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: designTokens.colors.primary.main,
          "&:hover": {
            backgroundColor: designTokens.colors.primary.main,
            color: designTokens.colors.background.default,
          },
        },
      },
    },
  },
});

export default theme;
