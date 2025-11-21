import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { deleteUser } from "@/services/users";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

function DeleteAccount() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!user) {
            toast.error("You must be logged in to delete your account.");
            return;
        }

        const isConfirmed = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (isConfirmed) {
            try {
                await deleteUser(user.id);
                toast.success("Your account has been successfully deleted.");
                logout();
                navigate('/login');
            } catch {
                toast.error("Failed to delete your account. Please try again later.");
            }
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <Button variant="destructive" onClick={handleDelete}>
                Delete My Account
            </Button>
        </div>
    );
}

export default DeleteAccount;
