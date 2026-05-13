import { NavbarRoutes } from "@/components/navbar-routes"
import { MobileSidebar } from "./Mobile-sidebar"
import { auth } from "@/auth"

export const Navbar = async () => {
    const session = await auth();

    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSidebar />
            <NavbarRoutes user={session?.user} />
        </div>
    )
}