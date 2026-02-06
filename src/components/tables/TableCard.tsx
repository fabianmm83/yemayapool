import { ClockIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface TableCardProps {
  tableNumber: number;
  type: 'Pool' | 'Snooker' | 'Carom';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  hourlyRate: number;
  currentTime?: string;
  currentCustomers?: number;
  onAction?: () => void;
}

export default function TableCard({
  tableNumber,
  type,
  status,
  hourlyRate,
  currentTime,
  currentCustomers,
  onAction
}: TableCardProps) {
  
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          text: 'Disponible',
          actionText: 'Iniciar Sesión',
          actionColor: 'bg-green-600 hover:bg-green-700'
        };
      case 'occupied':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          text: 'Ocupada',
          actionText: 'Ver Detalles',
          actionColor: 'bg-red-600 hover:bg-red-700'
        };
      case 'maintenance':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          text: 'Mantenimiento',
          actionText: 'Reportar',
          actionColor: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          text: 'Reservada',
          actionText: 'Ver Reserva',
          actionColor: 'bg-gray-600 hover:bg-gray-700'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`rounded-xl border-2 ${config.color} p-4 mb-3 shadow-sm`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${
              status === 'available' ? 'bg-green-500' :
              status === 'occupied' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
            <h3 className="font-bold text-lg">Mesa {tableNumber}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">{type}</p>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
          {config.text}
        </span>
      </div>

      {/* Info Grid - Optimizado para móvil */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-500 mr-2" />
          <div>
            <p className="text-xs text-gray-500">Tarifa</p>
            <p className="font-semibold">${hourlyRate}/h</p>
          </div>
        </div>
        
        {currentTime && (
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Tiempo</p>
              <p className="font-semibold">{currentTime}</p>
            </div>
          </div>
        )}
        
        {currentCustomers && (
          <div className="flex items-center">
            <UserGroupIcon className="h-4 w-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Personas</p>
              <p className="font-semibold">{currentCustomers}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Button - Full width en móvil */}
      <button
        onClick={onAction}
        className={`w-full ${config.actionColor} text-white py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center`}
      >
        {config.actionText}
        <span className="ml-2">→</span>
      </button>
    </div>
  );
}