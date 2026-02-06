import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';

// Tipos para mesas de billar
export type TableType = 'pool' | 'snooker' | 'carom' | 'other';
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';

export interface Table {
  id: string;
  number: number;
  name: string;
  type: TableType;
  status: TableStatus;
  hourlyRate: number; // En MXN
  description?: string;
  maxPlayers: number;
  location: {
    section: string; // Ej: "Sala Principal", "Terraza"
    position?: {
      x: number; // Posición en grid
      y: number;
    };
  };
  currentSession?: {
    sessionId: string;
    startTime: Date;
    customerId?: string;
    workerId: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TableSession {
  id: string;
  tableId: string;
  tableNumber: number;
  startTime: Date;
  endTime?: Date;
  customerId?: string;
  customerName?: string;
  workerId: string;
  workerName: string;
  totalAmount: number; // En MXN
  paidAmount: number;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

// Colecciones
const TABLES_COLLECTION = 'tables';
const SESSIONS_COLLECTION = 'sessions';

// Obtener todas las mesas
export const getAllTables = async (): Promise<Table[]> => {
  try {
    const tablesRef = collection(db, TABLES_COLLECTION);
    const q = query(tablesRef, orderBy('number'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Table[];
    
  } catch (error) {
    console.error('❌ Error obteniendo mesas:', error);
    throw error;
  }
};

// Obtener mesa por ID
export const getTableById = async (tableId: string): Promise<Table | null> => {
  try {
    const tableDoc = await getDoc(doc(db, TABLES_COLLECTION, tableId));
    
    if (tableDoc.exists()) {
      return { id: tableDoc.id, ...tableDoc.data() } as Table;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error obteniendo mesa:', error);
    throw error;
  }
};

// Crear nueva mesa
export const createTable = async (tableData: Omit<Table, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = new Date();
    const tableWithTimestamps = {
      ...tableData,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    
    const docRef = await addDoc(collection(db, TABLES_COLLECTION), tableWithTimestamps);
    console.log(`✅ Mesa creada: ${tableData.number} (${docRef.id})`);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creando mesa:', error);
    throw error;
  }
};

// Actualizar mesa
export const updateTable = async (tableId: string, updates: Partial<Table>): Promise<void> => {
  try {
    await updateDoc(doc(db, TABLES_COLLECTION, tableId), {
      ...updates,
      updatedAt: new Date()
    });
    console.log(`✅ Mesa actualizada: ${tableId}`);
  } catch (error) {
    console.error('❌ Error actualizando mesa:', error);
    throw error;
  }
};

// Iniciar sesión en mesa
export const startTableSession = async (
  tableId: string,
  workerId: string,
  workerName: string,
  customerId?: string,
  customerName?: string
): Promise<string> => {
  try {
    const table = await getTableById(tableId);
    
    if (!table) {
      throw new Error('Mesa no encontrada');
    }
    
    if (table.status !== 'available') {
      throw new Error(`La mesa no está disponible (estado: ${table.status})`);
    }
    
    const now = new Date();
    
    // 1. Crear sesión
    const sessionData: Omit<TableSession, 'id'> = {
      tableId,
      tableNumber: table.number,
      startTime: now,
      workerId,
      workerName,
      customerId,
      customerName,
      totalAmount: 0,
      paidAmount: 0,
      status: 'active',
      createdAt: now
    };
    
    const sessionRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);
    
    // 2. Actualizar estado de la mesa
    await updateTable(tableId, {
      status: 'occupied',
      currentSession: {
        sessionId: sessionRef.id,
        startTime: now,
        customerId,
        workerId
      }
    });
    
    console.log(`✅ Sesión iniciada: Mesa ${table.number} (${sessionRef.id})`);
    return sessionRef.id;
    
  } catch (error) {
    console.error('❌ Error iniciando sesión:', error);
    throw error;
  }
};

// Finalizar sesión de mesa
export const endTableSession = async (
  sessionId: string,
  totalAmount: number,
  paidAmount: number,
  notes?: string
): Promise<void> => {
  try {
    const sessionRef = doc(db, SESSIONS_COLLECTION, sessionId);
    const sessionDoc = await getDoc(sessionRef);
    
    if (!sessionDoc.exists()) {
      throw new Error('Sesión no encontrada');
    }
    
    const session = sessionDoc.data() as TableSession;
    const now = new Date();
    
    // 1. Actualizar sesión
    await updateDoc(sessionRef, {
      endTime: now,
      totalAmount,
      paidAmount,
      status: 'completed',
      notes,
      updatedAt: now
    });
    
    // 2. Actualizar mesa
    const tableRef = doc(db, TABLES_COLLECTION, session.tableId);
    await updateDoc(tableRef, {
      status: 'available',
      currentSession: null,
      updatedAt: now
    });
    
    console.log(`✅ Sesión finalizada: ${sessionId} - Total: $${totalAmount} MXN`);
    
  } catch (error) {
    console.error('❌ Error finalizando sesión:', error);
    throw error;
  }
};

// Obtener sesiones activas
export const getActiveSessions = async (): Promise<TableSession[]> => {
  try {
    const sessionsRef = collection(db, SESSIONS_COLLECTION);
    const q = query(
      sessionsRef, 
      where('status', '==', 'active'),
      orderBy('startTime', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TableSession[];
    
  } catch (error) {
    console.error('❌ Error obteniendo sesiones activas:', error);
    throw error;
  }
};