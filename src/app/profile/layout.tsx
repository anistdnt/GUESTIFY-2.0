import Link from "next/link";
const layout = ({
    children,
    profilebody,
}: {
    children: React.ReactNode;
    profilebody: React.ReactNode;
    // mypg: React.ReactNode,
}) => {
    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="w-full mx-auto bg-white rounded-xl shadow-md p-4 sm:p-8">
                <div>{children}</div>
                <div>
                    <div>{profilebody}</div>
                </div>
            </div>
        </div>
    )
}

export default layout
