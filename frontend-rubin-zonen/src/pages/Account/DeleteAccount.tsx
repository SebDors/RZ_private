import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

        try {
            await deleteUser(user.id);
            toast.success("Your account has been successfully deleted.");
            logout();
            navigate('/login');
        } catch {
            toast.error("Failed to delete your account. Please try again later.");
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-red-600">Delete Account</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete My Account</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default DeleteAccount;
