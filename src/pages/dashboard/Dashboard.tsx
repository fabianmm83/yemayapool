import TableCard from "../../components/tables/TableCard";

export default function Dashboard() {
  const quickStats = [
    { label: "Mesas Activas", value: "12/16", change: "+2", color: "text-primary-600" },
    { label: "Ingresos Hoy", value: "$2,450", change: "+15%", color: "text-green-600" },
    { label: "Clientes", value: "24", change: "+8", color: "text-blue-600" },
    { label: "Avg. Time", value: "2.5h", change: "-0.3h", color: "text-purple-600" },
  ];

  const recentTables = [
    { tableNumber: 5, type: "Pool", status: "occupied" as const, hourlyRate: 120, currentTime: "1:45", currentCustomers: 4 },
    { tableNumber: 3, type: "Snooker", status: "occupied" as const, hourlyRate: 180, currentTime: "0:30", currentCustomers: 2 },
    { tableNumber: 8, type: "Pool", status: "available" as const, hourlyRate: 120 },
    { tableNumber: 12, type: "Carom", status: "maintenance" as const, hourlyRate: 150 },
  ];

  return (
    <div className="pb-20 md:pb-8"> {/* Espacio para footer móvil */}
      {/* Header con padding seguro para notch móvil */}
      <div className="pt-4 px-4 md:pt-6 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1 text-sm">Bienvenido a Yemaya Pool</p>
            
            {/* Fecha y hora móvil */}
            <div className="mt-4 flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
              <div>
                <p className="text-sm text-gray-500">Hoy</p>
                <p className="font-semibold">{new Date().toLocaleDateString('es-MX', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Hora</p>
                <p className="font-bold text-lg">{new Date().toLocaleTimeString('es-MX', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
              </div>
            </div>
          </div>
          
          {/* Stats Grid - Scroll horizontal en móvil */}
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex space-x-4 min-w-max">
              {quickStats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow p-4 min-w-[140px]">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <div className="flex items-baseline mt-2">
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    <span className="ml-2 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {stat.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sección Mesas - Diseño móvil optimizado */}
      <div className="px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Mesas Recientes</h2>
            <a href="/admin/tables" className="text-primary-600 text-sm font-medium">
              Ver todas →
            </a>
          </div>
          
          {/* Lista de mesas - Una por línea en móvil */}
          <div className="space-y-3">
            {recentTables.map((table) => (
              <TableCard
                key={table.tableNumber}
                tableNumber={table.tableNumber}
                type={table.type as any}
                status={table.status}
                hourlyRate={table.hourlyRate}
                currentTime={table.currentTime}
                currentCustomers={table.currentCustomers}
                onAction={() => console.log(`Acción en mesa ${table.tableNumber}`)}
              />
            ))}
          </div>

          {/* Acciones rápidas - Grid responsivo */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition-shadow">
                <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold text-xl">+</span>
                </div>
                <p className="text-sm font-medium">Nueva Sesión</p>
              </button>
              
              <button className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition-shadow">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">$</span>
                </div>
                <p className="text-sm font-medium">Cobrar</p>
              </button>
              
              <button className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition-shadow">
                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">👥</span>
                </div>
                <p className="text-sm font-medium">Cliente Nuevo</p>
              </button>
              
              <button className="bg-white rounded-xl shadow p-4 text-center hover:shadow-md transition-shadow">
                <div className="h-10 w-10 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-yellow-600 font-bold">📊</span>
                </div>
                <p className="text-sm font-medium">Reporte</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}