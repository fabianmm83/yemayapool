export default function TablesManagement() {
  const tables = [
    { id: 1, number: 1, type: 'Pool', status: 'ocupada', hourlyRate: 120 },
    { id: 2, number: 2, type: 'Pool', status: 'disponible', hourlyRate: 120 },
    { id: 3, number: 3, type: 'Snooker', status: 'disponible', hourlyRate: 180 },
    { id: 4, number: 4, type: 'Pool', status: 'mantenimiento', hourlyRate: 120 },
    { id: 5, number: 5, type: 'Pool', status: 'ocupada', hourlyRate: 120 },
    { id: 6, number: 6, type: 'Carom', status: 'disponible', hourlyRate: 150 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return 'bg-green-100 text-green-800';
      case 'ocupada': return 'bg-red-100 text-red-800';
      case 'mantenimiento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Mesas</h1>
          <p className="text-gray-600 mt-2">Administra las 16 mesas del establecimiento</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lista de mesas */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Mesas</h2>
              <button className="btn-primary">
                + Agregar Mesa
              </button>
            </div>
            
            <div className="space-y-4">
              {tables.map((table) => (
                <div key={table.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        table.status === 'disponible' ? 'bg-green-500' :
                        table.status === 'ocupada' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <span className="font-semibold">Mesa {table.number}</span>
                      <span className="ml-3 text-sm text-gray-500">({table.type})</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      ${table.hourlyRate} MXN/hora
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(table.status)}`}>
                      {table.status}
                    </span>
                    <button className="text-primary-600 hover:text-primary-800">
                      Editar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mapa de mesas simple */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Disposición del Local</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 16 }, (_, i) => i + 1).map((tableNum) => (
                  <div 
                    key={tableNum}
                    className={`h-20 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                      tableNum % 4 === 0 ? 'bg-green-100 border-2 border-green-300' :
                      tableNum % 3 === 0 ? 'bg-red-100 border-2 border-red-300' :
                      'bg-gray-100 border-2 border-gray-200'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold">Mesa {tableNum}</div>
                      <div className="text-xs mt-1">
                        {tableNum % 4 === 0 ? 'Disponible' :
                         tableNum % 3 === 0 ? 'Ocupada' : 'Libre'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Ocupada</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    <span>Libre</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}