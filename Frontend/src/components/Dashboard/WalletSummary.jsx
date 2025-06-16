function WalletSummary() {
  return (
    <div className="w-full flex flex-col">
      <div className="p-6 bg-white">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Here's your financial overview</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Recent Transactions</h3>
            <p className="text-blue-600">View your latest activity</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Account Balance</h3>
            <p className="text-green-600">$12,345.67</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900">Monthly Budget</h3>
            <p className="text-purple-600">75% used</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletSummary
