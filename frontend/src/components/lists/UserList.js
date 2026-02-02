import React, { useState } from "react";
import * as mui from "@mui/material";
import { Search, MoreVert } from "@mui/icons-material";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";

const UserList = ({ users, onRoleChange, onDelete, onResetPassword }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * filteredUsers
   * Filters the user list by matching the search with username.
   */
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * sortedUsers
   * Sorts admins below or above normal users to highlight them.
   */
  const sortedUsers = [...filteredUsers].sort(
    (a, b) => (b.role === "ADMIN" ? 1 : -1) - (a.role === "ADMIN" ? 1 : -1)
  );

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleResetPasswordOpen = () => {
    setOpenPasswordDialog(true);
  };

  const handleResetPasswordClose = () => {
    setOpenPasswordDialog(false);
    handleMenuClose();
    setNewPassword("");
    setConfirmPassword("");
  };

  /**
   * handleSubmitPassword
   * calls onResetPassword with the new password for the selected user
   */
  const handleSubmitPassword = async () => {
    if (!selectedUser) return;
    if (newPassword !== confirmPassword) {
      return;
    }
    await onResetPassword(selectedUser.id, newPassword);
    handleResetPasswordClose();
  };

  return (
    <mui.Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <mui.Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <mui.TextField
          placeholder="Search user"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            maxWidth: 200,
            "& .MuiOutlinedInput-root": {
              borderRadius: "15px",
            },
          }}
          InputProps={{
            startAdornment: (
              <mui.InputAdornment position="start">
                <Search />
              </mui.InputAdornment>
            ),
          }}
        />
      </mui.Box>

      <mui.TableContainer component={mui.Paper}>
        <mui.Table size="small">
          <mui.TableHead>
            <mui.TableRow>
              <mui.TableCell sx={{ padding: "8px" }}>User</mui.TableCell>
              <mui.TableCell
                sx={{ padding: "8px 20px 8px 8px", textAlign: "right" }}
              >
                Role
              </mui.TableCell>
              <mui.TableCell sx={{ padding: "8px", width: "50px" }} />
            </mui.TableRow>
          </mui.TableHead>
          <mui.TableBody>
            {sortedUsers.map((user) => (
              <mui.TableRow key={user.id} hover>
                <mui.TableCell sx={{ padding: "8px" }}>
                  {user.username}
                </mui.TableCell>
                <mui.TableCell sx={{ padding: "8px", textAlign: "right" }}>
                  <mui.TextField
                    select
                    value={user.role}
                    onChange={(e) => onRoleChange(user.id, e.target.value)}
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 100 }}
                  >
                    <mui.MenuItem value="USER">User</mui.MenuItem>
                    <mui.MenuItem value="ADMIN">Admin</mui.MenuItem>
                  </mui.TextField>
                </mui.TableCell>

                <mui.TableCell sx={{ padding: "8px", textAlign: "center" }}>
                  <mui.IconButton
                    onClick={(e) => handleMenuOpen(e, user)}
                    sx={{
                      color:
                        selectedUser?.id === user.id
                          ? "primary.main"
                          : "inherit",
                    }}
                  >
                    <MoreVert />
                  </mui.IconButton>
                </mui.TableCell>
              </mui.TableRow>
            ))}
          </mui.TableBody>
        </mui.Table>
      </mui.TableContainer>

      <mui.Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <mui.MenuItem onClick={handleResetPasswordOpen}>
          <LockResetOutlinedIcon fontSize="small" sx={{ marginRight: 1 }} />
          Reset Password
        </mui.MenuItem>

        <mui.MenuItem
          onClick={() => {
            if (selectedUser) onDelete(selectedUser.id);
            handleMenuClose();
          }}
          disabled={selectedUser?.role === "ADMIN"}
        >
          <PersonRemoveOutlinedIcon fontSize="small" sx={{ marginRight: 1 }} />
          Delete User
        </mui.MenuItem>
      </mui.Menu>

      <mui.Dialog
        open={openPasswordDialog}
        onClose={handleResetPasswordClose}
        maxWidth="xs"
        fullWidth
      >
        <mui.DialogTitle>
          Reset Password for {selectedUser?.username}
        </mui.DialogTitle>
        <mui.DialogContent>
          <mui.TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            variant="outlined"
          />
          <mui.TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
          />
          {newPassword !== confirmPassword && (
            <mui.Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Passwords do not match!
            </mui.Typography>
          )}
        </mui.DialogContent>
        <mui.DialogActions>
          <mui.Button onClick={handleResetPasswordClose}>Cancel</mui.Button>
          <mui.Button
            variant="contained"
            onClick={handleSubmitPassword}
            disabled={!newPassword || newPassword !== confirmPassword}
          >
            Save
          </mui.Button>
        </mui.DialogActions>
      </mui.Dialog>
    </mui.Box>
  );
};

export default UserList;
