import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  visitCount: number;
  totalSpent: number; // En MXN
  lastVisit?: Date;
  preferences?: {
    favoriteTables?: number[];
    favoriteGames?: string[];
    usualHours?: string[];
  };
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerVisit {
  id: string;
  customerId: string;
  customerName: string;
  tableId: string;
  tableNumber: number;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  sessionId: string;
  notes?: string;
  createdAt: Date;
}

const CUSTOMERS_COLLECTION = 'customers';
const VISITS_COLLECTION = 'visits';

// Crear o actualizar cliente
export const upsertCustomer = async (phone: string, name: string, email?: string): Promise<Customer> => {
  try {
    // Buscar cliente por teléfono
    const customersRef = collection(db, CUSTOMERS_COLLECTION);
    const q = query(customersRef, where('phone', '==', phone));
    const snapshot = await getDocs(q);
    
    const now = new Date();
    
    if (!snapshot.empty) {
      // Cliente existe, actualizar
      const existingCustomer = snapshot.docs[0];
      const updates = {
        name,
        email,
        updatedAt: now
      };
      
      await updateDoc(doc(db, CUSTOMERS_COLLECTION, existingCustomer.id), updates);
      
      console.log(`✅ Cliente actualizado: ${name} (${phone})`);
      return { id: existingCustomer.id, ...existingCustomer.data(), ...updates } as Customer;
      
    } else {
      // Crear nuevo cliente
      const newCustomer: Omit<Customer, 'id'> = {
        name,
        email,
        phone,
        visitCount: 0,
        totalSpent: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now
      };
      
      const docRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), newCustomer);
      
      console.log(`✅ Nuevo cliente creado: ${name} (${phone})`);
      return { id: docRef.id, ...newCustomer };
    }
    
  } catch (error) {
    console.error('❌ Error con cliente:', error);
    throw error;
  }
};

// Registrar visita de cliente
export const registerCustomerVisit = async (
  customerId: string,
  tableId: string,
  tableNumber: number,
  sessionId: string,
  totalAmount: number,
  notes?: string
): Promise<void> => {
  try {
    const now = new Date();
    
    // 1. Registrar visita
    const visitData: Omit<CustomerVisit, 'id'> = {
      customerId,
      customerName: '', // Se llenará después
      tableId,
      tableNumber,
      startTime: now,
      endTime: now,
      totalAmount,
      sessionId,
      notes,
      createdAt: now
    };
    
    // 2. Actualizar estadísticas del cliente
    const customerRef = doc(db, CUSTOMERS_COLLECTION, customerId);
    const customerDoc = await getDoc(customerRef);
    
    if (customerDoc.exists()) {
      const customer = customerDoc.data() as Customer;
      
      await updateDoc(customerRef, {
        visitCount: customer.visitCount + 1,
        totalSpent: customer.totalSpent + totalAmount,
        lastVisit: now,
        updatedAt: now
      });
      
      // Actualizar nombre en la visita
      visitData.customerName = customer.name;
    }
    
    await addDoc(collection(db, VISITS_COLLECTION), visitData);
    
    console.log(`✅ Visita registrada: Cliente ${customerId} - $${totalAmount} MXN`);
    
  } catch (error) {
    console.error('❌ Error registrando visita:', error);
    throw error;
  }
};