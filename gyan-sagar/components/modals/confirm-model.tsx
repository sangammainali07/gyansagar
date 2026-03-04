"use client";
import {
    AlertDialog,    
    AlertDialogContent,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,  
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    
} from "../ui/alert-dialog";

interface ConfirmModelProps {
   children: React.ReactNode;
    onConfirm: () => void;
}

export const ConfirmModel = ({children, onConfirm}: ConfirmModelProps) => {  
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}  
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>  


                        Are you sure?

                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                    </AlertDialogDescription>


                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} className="bg-red-600 text-white hover:bg-red-700">
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

}