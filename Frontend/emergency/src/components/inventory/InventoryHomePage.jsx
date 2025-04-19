const InventoryHomePage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-400 via-green-500 to-lime-500">
            <div className="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md text-center">
                <h1 className="text-4xl font-bold mb-10 text-green-800">Inventory Management</h1>
                <div className="space-y-6 mb-10">
                    <Link
                        to="/inventory-list"
                        className="block w-full py-4 px-6 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded-lg"
                    >
                        View Inventory
                    </Link>
                    <Link
                        to="/inventory-form"
                        className="block w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                    >
