import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ChangePasswordForm } from "@/components/auth/change-password-form";

const SettingsPage = async () => {
    const session = await auth();

    if (!session?.user?.id) {
        return redirect("/");
    }

    return (
        <div className="p-6">
            <div className="max-w-screen-md mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-700">Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your account settings and security.</p>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
}
 
export default SettingsPage;
