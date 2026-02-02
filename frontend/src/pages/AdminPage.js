import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  resetPassword,
  updateRole,
} from "../services/authentication/adminService";
import UserList from "../components/lists/UserList";
import Layout from "../components/layout/Layout";
import * as mui from "@mui/material";
import { useSnackbar } from "../components/SnackbarProvider";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const { showSnackbar } = useSnackbar();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  /**
   * fetch all users when the component mounts.
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };
    fetchUsers()
      .then(() => {
        console.log("User data successfully fetched.");
      })
      .catch((error) => {
        console.error("Error during fetching: ", error);
      });
  }, []);

  const openDeleteDialog = (userId) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setUserToDelete(null);
    setDeleteDialogOpen(false);
  };

  /**
   * confirmDelete
   * Deletes a user after confirmation and updates the user list.
   */
  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      setUsers(users.filter((user) => user.id !== userToDelete));
      showSnackbar("User deleted successfully.", "success");
    } catch {
      showSnackbar("Error deleting user.", "error");
    } finally {
      closeDeleteDialog();
    }
  };

  /**
   * handleResetPassword
   * Api call to reset a user's password
   */
  const handleResetPassword = async (userId, newPassword) => {
    try {
      await resetPassword(userId, newPassword);
      showSnackbar("Password reset successfully.", "success");
    } catch {
      showSnackbar("Error resetting password.", "error");
    }
  };

  /**
   * handleRoleChange
   * Updates the user role.
   */
  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateRole(userId, newRole);
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      showSnackbar("Role updated successfully.", "success");
    } catch {
      showSnackbar("Error updating role.", "error");
    }
  };

  return (
    <Layout>
      <mui.Typography
        variant="h2"
        gutterBottom
        color="text.primary"
        textAlign="center"
        margin={4}
      >
        User Administration
      </mui.Typography>

      <UserList
        users={users}
        onDelete={openDeleteDialog}
        onResetPassword={handleResetPassword}
        onRoleChange={handleRoleChange}
      />

      <mui.Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <mui.DialogTitle id="delete-dialog-title">
          Confirm deletion
        </mui.DialogTitle>
        <mui.DialogContent>
          <mui.DialogContentText id="delete-dialog-description">
            Do you really want to delete this user? This action cannot be
            undone.
          </mui.DialogContentText>
        </mui.DialogContent>
        <mui.DialogActions>
          <mui.Button onClick={closeDeleteDialog}>Cancel</mui.Button>
          <mui.Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </mui.Button>
        </mui.DialogActions>
      </mui.Dialog>
    </Layout>
  );
};

export default AdminPage;
